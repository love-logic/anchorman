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
anchormanPanel.preferredSize.width = 280; // Minimum width for panel

// Header
var headerGroup = anchormanPanel.add("group");
headerGroup.orientation = "row";
headerGroup.alignment = "center";
headerGroup.spacing = 8;

// Main content area - responsive layout
var mainContentGroup = anchormanPanel.add("group");
mainContentGroup.orientation = "column"; // Start with vertical, will adjust based on width
mainContentGroup.alignChildren = "fill";
mainContentGroup.spacing = 15;
mainContentGroup.alignment = "fill";

// Left side: 3x3 Anchor Point Grid
var gridGroup = mainContentGroup.add("group");
gridGroup.orientation = "column";
gridGroup.alignChildren = "left";
gridGroup.spacing = 3;
gridGroup.preferredSize.width = 150; // Minimum width for grid

// Grid title
var gridTitle = gridGroup.add("statictext", undefined, "Anchor Point Position");
gridTitle.graphics.font = ScriptUI.newFont("Arial", "Regular", 11);

// Create 3x3 button grid
var gridPanel = gridGroup.add("panel");
gridPanel.orientation = "column";
gridPanel.spacing = 2;
gridPanel.margins = 8;
gridPanel.preferredSize.width = 130; // Fixed width for consistent grid

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

// Right side: Options and Actions
var rightSideGroup = mainContentGroup.add("group");
rightSideGroup.orientation = "column";
rightSideGroup.alignChildren = "fill";
rightSideGroup.spacing = 15;
rightSideGroup.alignment = "fill"; // Allow to expand
rightSideGroup.preferredSize.width = 180; // Minimum width for right side

// Options section
var optionsGroup = rightSideGroup.add("group");
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
var actionsGroup = rightSideGroup.add("group");
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
footerGroup.alignment = "left";
footerGroup.spacing = 6;
footerGroup.margins = [0, 14, 0, 0]; // Add 14px top margin

// Add logo to footer
try {
    var logoFile = new File($.fileName.substring(0, $.fileName.lastIndexOf('/')) + '/anchorman-logo.png');
    if (logoFile.exists) {
        var footerLogo = footerGroup.add("image", undefined, logoFile);
        footerLogo.preferredSize.width = 30;
        footerLogo.preferredSize.height = 30;
        footerLogo.helpTip = "You Stay Classy, After Effects.";
        
        // Make logo clickable - opens main website
        footerLogo.onClick = function() {
            openURL("http://loveandlogic.co.uk/");
        };
    }
} catch (e) {
    // Logo file not found, continue without it
}

var footerText = footerGroup.add("statictext", undefined, "Made by Love & Logic");
footerText.graphics.font = ScriptUI.newFont("Arial", "Regular", 9);
footerText.helpTip = "Visit Love & Logic website";

// Make footer text clickable too
footerText.onClick = function() {
    openURL("http://loveandlogic.co.uk/");
};

/**
 * Responsive layout function - switches between horizontal and vertical based on panel width
 */
function updateResponsiveLayout() {
    try {
        var panelWidth = anchormanPanel.size ? anchormanPanel.size.width : anchormanPanel.preferredSize.width;
        var breakpoint = 380; // Width threshold for switching layout
        
        if (panelWidth >= breakpoint) {
            // Wide enough for horizontal layout
            if (mainContentGroup.orientation !== "row") {
                mainContentGroup.orientation = "row";
                gridGroup.alignment = "left";
                rightSideGroup.alignment = "fill";
                anchormanPanel.layout.layout(true);
            }
        } else {
            // Too narrow, switch to vertical layout
            if (mainContentGroup.orientation !== "column") {
                mainContentGroup.orientation = "column";
                gridGroup.alignment = "fill";
                rightSideGroup.alignment = "fill";
                anchormanPanel.layout.layout(true);
            }
        }
    } catch (e) {
        // Layout update failed, continue silently
    }
}

// Set up resize handler for responsive behavior
try {
    anchormanPanel.onResize = function() {
        updateResponsiveLayout();
    };
} catch (e) {
    // onResize not supported, responsive behavior will work on initial load only
}

// Initial layout check
updateResponsiveLayout();

/**
 * Helper function to open URL in browser - uses multiple fallback methods
 */
function openURL(url) {
    try {
        // Method 1: Try using system.callSystem with proper escaping
        if ($.os.indexOf("Windows") !== -1) {
            // Windows - try multiple approaches
            try {
                system.callSystem('start "" "' + url + '"');
                return;
            } catch (e1) {
                try {
                    system.callSystem('cmd /c start "" "' + url + '"');
                    return;
                } catch (e2) {
                    // Fall through to alert
                }
            }
        } else {
            // macOS/Unix
            try {
                system.callSystem('open "' + url + '"');
                return;
            } catch (e3) {
                // Fall through to alert
            }
        }
    } catch (e) {
        // system.callSystem failed completely
    }
    
    // Fallback: Show alert with URL
    alert("Please visit: " + url + "\n\n(Copy this URL to your browser)");
}

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

// Force layout refresh for dockable panels and apply responsive layout
if (anchormanPanel instanceof Panel) {
    anchormanPanel.layout.layout(true);
    updateResponsiveLayout(); // Apply responsive behavior
} 