/**
 * Anchorman - Script UI Panel
 * Quick anchor point positioning for After Effects
 * 
 * Installation: Place in After Effects > Scripts > ScriptUI Panels folder
 * Access: Window > Anchorman.jsx
 */

// Detect if running as dockable ScriptUI Panel or standalone script
var anchormanPanel;
if (this instanceof Panel) {
    // Running as dockable ScriptUI Panel from Window menu
    anchormanPanel = this;
} else {
    // Running as standalone script
    anchormanPanel = new Window("palette", "Anchorman", undefined, {resizeable: true});
}

anchormanPanel.orientation = "column";
anchormanPanel.alignChildren = "fill";
anchormanPanel.spacing = 10;
anchormanPanel.margins = 15;

// Header
var headerGroup = anchormanPanel.add("group");
headerGroup.orientation = "row";
headerGroup.alignment = "center";
headerGroup.spacing = 8;

// 3x3 Anchor Point Grid
var gridGroup = anchormanPanel.add("group");
gridGroup.orientation = "column";
gridGroup.alignChildren = "center";
gridGroup.spacing = 3;

// Grid title
var gridTitle = gridGroup.add("statictext", undefined, "Anchor Point Position");
gridTitle.graphics.font = ScriptUI.newFont("Arial", "Regular", 11);

// Create 3x3 button grid
var gridPanel = gridGroup.add("panel");
gridPanel.orientation = "column";
gridPanel.spacing = 2;
gridPanel.margins = 8;

// Grid positions and their labels
var positions = [
    ["top-left", "top-center", "top-right"],
    ["center-left", "center", "center-right"], 
    ["bottom-left", "bottom-center", "bottom-right"]
];

var tooltips = [
    ["Top Left", "Top Center", "Top Right"],
    ["Center Left", "Center", "Center Right"],
    ["Bottom Left", "Bottom Center", "Bottom Right"]
];

// Create grid rows
for (var row = 0; row < 3; row++) {
    var rowGroup = gridPanel.add("group");
    rowGroup.orientation = "row";
    rowGroup.spacing = 2;
    
    for (var col = 0; col < 3; col++) {
        var btn = rowGroup.add("button", undefined, "●");
        btn.preferredSize.width = 35;
        btn.preferredSize.height = 35;
        btn.helpTip = "Move anchor to " + tooltips[row][col].toLowerCase();
        
        // Store position data
        btn.anchorPosition = positions[row][col];
        
        // Event handler
        btn.onClick = function() {
            var keepVisual = keepVisualCheckbox.value;
            moveAnchorPoint(this.anchorPosition, keepVisual);
        };
    }
}

// Options section
var optionsGroup = anchormanPanel.add("group");
optionsGroup.orientation = "column";
optionsGroup.alignChildren = "left";
optionsGroup.spacing = 8;

var optionsTitle = optionsGroup.add("statictext", undefined, "Options");
optionsTitle.graphics.font = ScriptUI.newFont("Arial", "Regular", 11);

// Keep visual position checkbox
var keepVisualCheckbox = optionsGroup.add("checkbox", undefined, "Keep visual position");
keepVisualCheckbox.value = true;
keepVisualCheckbox.helpTip = "Maintains layer's screen position when anchor point moves";



// Actions section
var actionsGroup = anchormanPanel.add("group");
actionsGroup.orientation = "column";
actionsGroup.alignChildren = "fill";
actionsGroup.spacing = 5;

var actionsTitle = actionsGroup.add("statictext", undefined, "Actions");
actionsTitle.graphics.font = ScriptUI.newFont("Arial", "Regular", 11);

// Keyframe button
var keyframeBtn = actionsGroup.add("button", undefined, "◆ Keyframe Anchor Point");
keyframeBtn.graphics.font = ScriptUI.newFont("Arial", "Regular", 14); // Larger font for bigger diamond
keyframeBtn.helpTip = "Add keyframes to anchor point at current time";
keyframeBtn.onClick = function() {
    addAnchorKeyframes();
};

// Footer with logo
var footerGroup = anchormanPanel.add("group");
footerGroup.orientation = "row";
footerGroup.alignment = "center";
footerGroup.spacing = 6;
footerGroup.margins = [0, 4, 0, 0]; // Add 4px top margin

// Add logo to footer
try {
    var logoFile = new File($.fileName.substring(0, $.fileName.lastIndexOf('/')) + '/anchorman-logo.png');
    if (logoFile.exists) {
        var footerLogo = footerGroup.add("image", undefined, logoFile);
        footerLogo.preferredSize.width = 30;
        footerLogo.preferredSize.height = 30;
        footerLogo.helpTip = "Visit loveandlogic.co.uk for more info";
        
        // Make logo clickable - opens blog post
        footerLogo.onClick = function() {
            try {
                var url = "https://loveandlogic.co.uk/thoughts-feelings/anchorman-free-after-effect-script-plugin/";
                if ($.os.indexOf("Windows") !== -1) {
                    // Windows
                    system.callSystem('cmd /c start "" "' + url + '"');
                } else {
                    // macOS
                    system.callSystem('open "' + url + '"');
                }
            } catch (e) {
                alert("Visit: loveandlogic.co.uk/thoughts-feelings/anchorman-free-after-effect-script-plugin/");
            }
        };
    }
} catch (e) {
    // Logo file not found, continue without it
}

var footerText = footerGroup.add("statictext", undefined, "You Stay Classy, After Effects.");
footerText.graphics.font = ScriptUI.newFont("Arial", "Regular", 9);
footerText.helpTip = "Visit loveandlogic.co.uk for more info";

// Make footer text clickable too
footerText.onClick = function() {
    try {
        var url = "https://loveandlogic.co.uk/thoughts-feelings/anchorman-free-after-effect-script-plugin/";
        if ($.os.indexOf("Windows") !== -1) {
            // Windows
            system.callSystem('cmd /c start "" "' + url + '"');
        } else {
            // macOS
            system.callSystem('open "' + url + '"');
        }
    } catch (e) {
        alert("Visit: loveandlogic.co.uk/thoughts-feelings/anchorman-free-after-effect-script-plugin/");
    }
};

/**
 * Move anchor point to specified position
 */
function moveAnchorPoint(position, keepVisual) {
    app.beginUndoGroup("Anchorman: Move Anchor Point");
    
    try {
        var comp = app.project.activeItem;
        
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select a composition");
            app.endUndoGroup();
            return;
        }
        
        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert("Please select one or more layers");
            app.endUndoGroup();
            return;
        }
        
        var layersToProcess = selectedLayers;
        var processedCount = 0;
        
        for (var i = 0; i < layersToProcess.length; i++) {
            var layer = layersToProcess[i];
            
            // Skip layers that don't have anchor point property
            if (!layer.anchorPoint) continue;
            
            var sourceRect = getLayerBounds(layer);
            if (!sourceRect) continue;
            
            var newAnchor = calculateAnchorPosition(position, sourceRect);
            var oldAnchor = layer.anchorPoint.value;
            
            // Store original position if keeping visual position
            var originalPosition;
            if (keepVisual) {
                originalPosition = layer.position.value;
            }
            
            // Set new anchor point
            layer.anchorPoint.setValueAtTime(comp.time, newAnchor);
            
            // Compensate position to maintain visual placement
            if (keepVisual) {
                var anchorDelta = [
                    newAnchor[0] - oldAnchor[0],
                    newAnchor[1] - oldAnchor[1]
                ];
                
                var newPosition = [
                    originalPosition[0] + anchorDelta[0],
                    originalPosition[1] + anchorDelta[1]
                ];
                
                if (originalPosition.length > 2) {
                    newPosition.push(originalPosition[2]);
                }
                
                layer.position.setValueAtTime(comp.time, newPosition);
            }
            
            processedCount++;
        }
        
        var layerText = processedCount === 1 ? "layer" : "layers";
        var positionText = position.replace("-", " ");
        // Success feedback could be shown in a small dialog if desired
        
        app.endUndoGroup();
        
    } catch (error) {
        alert("Error moving anchor point: " + error.toString());
        app.endUndoGroup();
    }
}

/**
 * Add keyframes to anchor point property
 */
function addAnchorKeyframes() {
    app.beginUndoGroup("Anchorman: Add Anchor Keyframes");
    
    try {
        var comp = app.project.activeItem;
        
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select a composition");
            app.endUndoGroup();
            return;
        }
        
        var selectedLayers = comp.selectedLayers;
        if (selectedLayers.length === 0) {
            alert("Please select one or more layers");
            app.endUndoGroup();
            return;
        }
        
        var layersToProcess = selectedLayers;
        var processedCount = 0;
        
        for (var i = 0; i < layersToProcess.length; i++) {
            var layer = layersToProcess[i];
            
            // Skip layers that don't have anchor point property
            if (!layer.anchorPoint) continue;
            
            // Add keyframe at current time
            layer.anchorPoint.setValueAtTime(comp.time, layer.anchorPoint.value);
            processedCount++;
        }
        
        var layerText = processedCount === 1 ? "layer" : "layers";
        alert("Added keyframes to " + processedCount + " " + layerText);
        
        app.endUndoGroup();
        
    } catch (error) {
        alert("Error adding keyframes: " + error.toString());
        app.endUndoGroup();
    }
}

/**
 * Calculate anchor position based on position identifier and layer bounds
 */
function calculateAnchorPosition(position, bounds) {
    var x, y;
    
    // Calculate X position
    switch (position) {
        case "top-left":
        case "center-left":
        case "bottom-left":
            x = bounds.left;
            break;
        case "top-center":
        case "center":
        case "bottom-center":
            x = bounds.left + bounds.width / 2;
            break;
        case "top-right":
        case "center-right":
        case "bottom-right":
            x = bounds.left + bounds.width;
            break;
        default:
            x = bounds.left + bounds.width / 2;
    }
    
    // Calculate Y position
    switch (position) {
        case "top-left":
        case "top-center":
        case "top-right":
            y = bounds.top;
            break;
        case "center-left":
        case "center":
        case "center-right":
            y = bounds.top + bounds.height / 2;
            break;
        case "bottom-left":
        case "bottom-center":
        case "bottom-right":
            y = bounds.top + bounds.height;
            break;
        default:
            y = bounds.top + bounds.height / 2;
    }
    
    return [x, y];
}

/**
 * Get layer bounds for anchor point calculation
 */
function getLayerBounds(layer) {
    try {
        var sourceRect;
        
        // For text layers, use sourceRectAtTime
        if (layer instanceof TextLayer) {
            sourceRect = layer.sourceRectAtTime(layer.containingComp.time, false);
        }
        // For shape layers and other vector layers
        else if (layer instanceof ShapeLayer) {
            sourceRect = layer.sourceRectAtTime(layer.containingComp.time, false);
        }
        // For AVLayer with source (footage, comps, etc.)
        else if (layer.source) {
            if (layer.source instanceof CompItem) {
                // For comp layers, use comp dimensions
                sourceRect = {
                    left: 0,
                    top: 0,
                    width: layer.source.width,
                    height: layer.source.height
                };
            } else {
                // For footage layers, use source dimensions  
                sourceRect = {
                    left: 0,
                    top: 0,
                    width: layer.source.width,
                    height: layer.source.height
                };
            }
        }
        // Fallback: try sourceRectAtTime
        else {
            try {
                sourceRect = layer.sourceRectAtTime(layer.containingComp.time, false);
            } catch (e) {
                // If all else fails, use default dimensions
                sourceRect = {
                    left: 0,
                    top: 0,
                    width: 100,
                    height: 100
                };
            }
        }
        
        return sourceRect;
        
    } catch (error) {
        // Return default bounds if we can't determine layer bounds
        return {
            left: 0,
            top: 0,
            width: 100,
            height: 100
        };
    }
}

// Show panel only if it's a standalone window (not dockable panel)
if (anchormanPanel instanceof Window) {
    anchormanPanel.center();
    anchormanPanel.show();
}

// Force layout refresh for dockable panels
if (anchormanPanel instanceof Panel) {
    anchormanPanel.layout.layout(true);
} 