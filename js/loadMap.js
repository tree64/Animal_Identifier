require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Search",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/widgets/FeatureTable",
    "esri/widgets/LayerList",
    "esri/core/watchUtils",
    "esri/widgets/Expand",
    "esri/widgets/BasemapGallery",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/on",
    "esri/core/watchUtils",
    "esri/widgets/Editor",
    "esri/widgets/Editor/CreateWorkflow",
    "esri/widgets/Editor/UpdateWorkflow",
    "esri/widgets/Locate",
    "esri/widgets/FeatureForm",
    "esri/widgets/FeatureTemplates",
    "dojo/dom-class",
    "esri/widgets/Popup",
    "esri/PopupTemplate",
    "esri/widgets/Home",
    "dojo/json",
    "esri/widgets/Legend"

    
 ], function(esriConfig, Map, MapView, FeatureLayer, Search, QueryTask, Query, FeatureTable, LayerList, watchUtils, Expand,
  BasemapGallery, domConstruct, dom, on, watchUtils, Editor, CreateWorkflow, UpdateWorkflow, Locate, FeatureForm, FeatureTemplates, domClass,  Popup, PopupTemplate, Home, Legend) {
  
  esriConfig.apiKey = "AAPK485bd483be544e7a81f95ec44c935768P1KiKSLDlVqfdCUccKq13y4MXw2VF57BG-nUpacjvrgCpyzLkAap4Fbg8b-QH9hI";

  //creating base map
  const map = new Map({
   basemap: "dark-gray-vector" //basemap: "dark-gray-vector"(arcgis/topographic), (arcgis/outdoor)
  });

  //creating map view centering on glacier national park
  const view = new MapView({
   container: "viewDiv",
   map: map,
   center: [-113.8061405,48.6836922 ], // longitude and latitude for Glacier National Park, 113.8061405°W 48.6836922°N longitude, latitude for Naperville 41.74779842602606, -88.15690516211465
   zoom: 9  //17
  }
  );

  //creating the home button to center the map 
  var homeBtn = new Home({
    view: view
  });

  //create Animal Sightings Icon and adjust for scale
  const pictureMarkerSymbol7 = {
    type: "picture-marker", // Type of the symbol
    url:"https://static.arcgis.com/images/Symbols/NPS/Deer_viewing_1.png",//white deer icon //"https://static.arcgis.com/images/Symbols/NPS/Deer_viewing.png", //black deer icon// URL to the image
    angle: 0,
    xoffset: 0,
    yoffset: 0
  };
  
  // Define a simple renderer using the JSON-based symbol for Animal Sightings
  const animalsightingRenderer = {
    type: "simple", // Use a simple renderer
    symbol: pictureMarkerSymbol7, // Assign the JSON PictureMarkerSymbol
    visualVariables: [
      {
        type: "size",
        field: null, // Use scale instead of a field
        stops: [
          { value: 10000, size: 10 }, // Small marker at a large scale
          { value: 5000, size: 16 },
          { value: 2500, size: 20 },
          { value: 1000, size: 24 } // Larger marker at a small scale
        ]
      }
    ]
  };

// Define a pop-up for Animal Sightings with attachment support
const popupAnimalSighting = {
  "title": "<b>Animal Sighting</b>",
  "content": [
    {
      type: "fields",
      fieldInfos: [
        { fieldName: "Species", label: "Species" },
        { fieldName: "Date_Time", label: "Date" },
        { fieldName: "Location_Desc", label: "Location" },
        { fieldName: "UserName", label: "User Name" }
      ]
    },
    {
      type: "attachments" // This will display any attachments in the popup
    }
  ]
};

//Animal Sighting feature layer (points)----------------------
const animalSightingLayer = new FeatureLayer({
  url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Animal_Sightings2/FeatureServer", //https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Animal_Sightings_1/FeatureServer", 
  title: "Animal Sightings",
  renderer: animalsightingRenderer,
  outFields: ["Species","Date_Time","Location_Desc", "UserName"], //"Species of Animal"
  popupTemplate: popupAnimalSighting
});

// Add the layer to the map
  map.add(animalSightingLayer);

   //create Trail Heads Icon and adjust for scale
   const pictureMarkerSymbol6 = {
    type: "picture-marker", // Type of the symbol
    url: "https://static.arcgis.com/images/Symbols/NPS/Hiking.png",// URL to the image
    angle: 0,
    xoffset: 0,
    yoffset: 0
  };
  
  // Define a simple renderer using the JSON-based symbol for Trail Heads
  const trailHeadsRenderer = {
    type: "simple", // Use a simple renderer
    symbol: pictureMarkerSymbol6, // Assign the JSON PictureMarkerSymbol
    visualVariables: [
      {
        type: "size",
        field: null, // Use scale instead of a field
        stops: [
          { value: 10000, size: 10 }, // Small marker at a large scale
          { value: 5000, size: 16 },
          { value: 2500, size: 20 },
          { value: 1000, size: 24 } // Larger marker at a small scale
        ]
      }
    ]
  };
 
    //Define a pop-up for Trail Heads
  const popupTrailHeads = {
     "title": "<b>Trail Heads<b>",
     "content": "{POINAME}<br><b></b> {POITYPE}, {UNITNAME}"
}    
    
//Trail Heads feature layer (points), 
  const trailHeadsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/GNP_POI_TrailHeads/FeatureServer",
    title: "Trail Heads",
    renderer: trailHeadsRenderer,
    outFields: ["POINAME","POITYPE","UNITNAME"],
    popupTemplate: popupTrailHeads
  });
  // Add the layer to the map
    map.add(trailHeadsLayer);


      //create Restrooms Icon and adjust for scale
      const pictureMarkerSymbol5 = {
        type: "picture-marker", // Type of the symbol
        url: "https://static.arcgis.com/images/Symbols/NPS/Restrooms.png",// URL to the image
        angle: 0,
        xoffset: 0,
        yoffset: 0
      };
      
      // Define a simple renderer using the JSON-based symbol
      const RestroomsRenderer = {
        type: "simple", // Use a simple renderer
        symbol: pictureMarkerSymbol5, // Assign the JSON PictureMarkerSymbol
        visualVariables: [
          {
            type: "size",
            field: null, // Use scale instead of a field
            stops: [
              { value: 10000, size: 10 }, // Small marker at a large scale
              { value: 5000, size: 16 },
              { value: 2500, size: 20 },
              { value: 1000, size: 24 } // Larger marker at a small scale
            ]
          }
        ]
      };

//Define a pop-up for Restrooms
 const popupRestrooms = {
     "title": "<b>RestRooms<b>",
     "content": "{POINAME}<br><b></b> {NOTES}"
}    
     
//Trail Heads feature layer (points), 
 const RestRoomsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/GNP_POI_Restrooms/FeatureServer",
    title: "RestRooms",
    renderer: RestroomsRenderer,
    outFields: ["POINAME","NOTES"],
    popupTemplate: popupRestrooms
  });
 // Add the layer to the map
  map.add(RestRoomsLayer);
  
  
  // Create the JSON-based PictureMarkerSymbol for Viewing Area
const pictureMarkerSymbol4 = {
  type: "picture-marker", // Type of the symbol
  url: "https://static.arcgis.com/images/Symbols/NPS/Scenic_viewpoint_.png",//"https://static.arcgis.com/images/Symbols/NPS/Viewing_area.png",// URL to the image
  angle: 0,
  xoffset: 0,
  yoffset: 0
};

// Define a simple renderer using the JSON-based symbo for View Points
const viewPointsRenderer = {
  type: "simple", // Use a simple renderer
  symbol: pictureMarkerSymbol4, // Assign the JSON PictureMarkerSymbol
  visualVariables: [
    {
      type: "size",
      field: null, // Use scale instead of a field
      stops: [
        { value: 10000, size: 10 }, // Small marker at a large scale
        { value: 5000, size: 16 },
        { value: 2500, size: 20 },
        { value: 1000, size: 24 } // Larger marker at a small scale
      ]
    }
  ]
};

  //Define a pop-up for View Points
 const popupViewPoints = {
     "title": "<b>View Points<b>",
     "content": "{POINAME}<br><b></b> {NOTES}"
}    

//View Points feature layer (points), 
  const viewPointsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/GNP_POI_ViewPoints/FeatureServer",
    title: "View Points",
    renderer: viewPointsRenderer,
    outFields: ["POINAME","NOTES"],
    popupTemplate: popupViewPoints
  });

// Add the layer to the map
  map.add(viewPointsLayer);
  
// Create the JSON-based PictureMarkerSymbol for Ranger Stations
const pictureMarkerSymbol3 = {
  type: "picture-marker", // Type of the symbol
  url: "https://static.arcgis.com/images/Symbols/NPS/Ranger_station.png",//"https://static.arcgis.com/images/Symbols/NPS/Picnic_area.png", // URL to the image
  angle: 0,
  xoffset: 0,
  yoffset: 0
};

// Define a simple renderer using the JSON-based symbol for Ranger Stations
const RangerStationRenderer = {
  type: "simple", // Use a simple renderer
  symbol: pictureMarkerSymbol3, // Assign the JSON PictureMarkerSymbol
  visualVariables: [
    {
      type: "size",
      field: null, // Use scale instead of a field
      stops: [
        { value: 10000, size: 10 }, // Small marker at a large scale
        { value: 5000, size: 16 },
        { value: 2500, size: 20 },
        { value: 1000, size: 24 } // Larger marker at a small scale
      ]
    }
  ]
};

  //Define a pop-up for Ranger Station
    const popupRangerStation = {
     "title": "<b>Ranger Stations<b>",
     "content": "{POINAME}<br><b></b> {POITYPE}"
}    

//Ranger Stations feature layer (points), 
    const RangerStationLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/GNP_POI_RangerStation/FeatureServer",
    title: "Ranger Stations",
    renderer: RangerStationRenderer,
    outFields: ["POINAME","POITYPE"],
    popupTemplate: popupRangerStation
  });
// Add the layer to the map
  map.add(RangerStationLayer);

  // Create the JSON-based PictureMarkerSymbol for Picnic Areas
const pictureMarkerSymbol1 = {
  type: "picture-marker", // Type of the symbol
  url: "https://static.arcgis.com/images/Symbols/NPS/Picnic_area.png", // URL to the image
  angle: 0,
  xoffset: 0,
  yoffset: 0
};

// Define a simple renderer using the JSON-based symbol for Picnic Areas
const picnicAreasRenderer = {
  type: "simple", // Use a simple renderer
  symbol: pictureMarkerSymbol1, // Assign the JSON PictureMarkerSymbol
  visualVariables: [
    {
      type: "size",
      field: null, // Use scale instead of a field
      stops: [
        { value: 10000, size: 10 }, // Small marker at a large scale
        { value: 5000, size: 16 },
        { value: 2500, size: 20 },
        { value: 1000, size: 24 } // Larger marker at a small scale
      ]
    }
  ]
};
      //Define a pop-up for Picnic Areas
    const popuppicnicAreas = {
     "title": "<b>Picnic Areas<b>",
     "content": "{POINAME}<br><b></b> {POITYPE}"
}    

//Picnic Areas feature layer (points), 
    const PicnicAreasLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/GNP_POI_PicnicArea/FeatureServer",
    title: "Picnic Areas",
    renderer: picnicAreasRenderer,
    outFields: ["POINAME","POITYPE"],
    popupTemplate: popuppicnicAreas
  });
// Add the layer to the map
  map.add(PicnicAreasLayer);
    
   
   // Create the JSON-based PictureMarkerSymbol for Parking Lots
const pictureMarkerSymbol2 = {
  type: "picture-marker", // Type of the symbol
  url: "https://static.arcgis.com/images/Symbols/NPS/Parking.png", // URL to the image
  angle: 0,
  xoffset: 0,
  yoffset: 0
};

// Define a simple renderer using the JSON-based symbol
const parkingRenderer = {
  type: "simple", // Use a simple renderer
  symbol: pictureMarkerSymbol2, // Assign the JSON PictureMarkerSymbol
  visualVariables: [
    {
      type: "size",
      field: null, // Use scale instead of a field
      stops: [
        { value: 10000, size: 10 }, // Small marker at a large scale
        { value: 5000, size: 16 },
        { value: 2500, size: 20 },
        { value: 1000, size: 24 } // Larger marker at a small scale
      ]
    }
  ]
};
  
    //Define a pop-up for Parking
    const popupParking = {
     "title": "<b>Parking Lots<b>",
     "content": "{POINAME}<br><b></b> {POITYPE}, {NOTES}"
}    

//Parking Lots feature layer (points), 
    const ParkingLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/GNP_POI_Parking/FeatureServer",
    title: "Parking Lots",
    renderer: parkingRenderer,
    outFields: ["POINAME","POITYPE", "NOTES"],
    popupTemplate: popupParking
  });
// Add the layer to the map
  map.add(ParkingLayer);
    
// Create the JSON-based PictureMarkerSymbol for Campgrounds
const pictureMarkerSymbol = {
  type: "picture-marker", // Type of the symbol
  url: "https://static.arcgis.com/images/Symbols/NPS/Campsite.png", // URL to the image
  angle: 0,
  xoffset: 0,
  yoffset: 0
};

// Define a simple renderer using the JSON-based symbol
const CampgroundsRenderer = {
  type: "simple", // Use a simple renderer
  symbol: pictureMarkerSymbol, // Assign the JSON PictureMarkerSymbol
  visualVariables: [
    {
      type: "size",
      field: null, // Use scale instead of a field
      stops: [
        { value: 10000, size: 10 }, // Small marker at a large scale
        { value: 5000, size: 16 },
        { value: 2500, size: 20 },
        { value: 1000, size: 24 } // Larger marker at a small scale
      ]
    }
  ]
};

    //Define a pop-up for Campgrounds
    const popupCampgrounds = {
     "title": "<b>Campgrounds<b>",
     "content": "{POINAME}<br><b></b> {POITYPE}, {NOTES}"
}    

//Campgrounds feature layer (points), 
    const CampgroundsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/GNP_POI_Campgrounds/FeatureServer",
    title: "Campgrounds",
    renderer: CampgroundsRenderer,
    outFields: ["POINAME","POITYPE", "NOTES"],
    popupTemplate: popupCampgrounds
  });

  // Add the layer to the map
  map.add(CampgroundsLayer);
    
  // Define a pop-up for Trails -----------see about adding links to all trails for more information. 
   const popupTrails = { 
    "title": "<b>Trails</b>",
    "content": "{NAME} <br><b><b>,{AREA},{Miles}, {DESC_SEG}, {TRAILROUTE}"
   }

   const TrailsRenderer = {
    type: "simple",
    symbol: {
      color: "#FF0000",
      type: "simple-line",
      style: "solid",  
    }
  };

  //Adding Trails feature layer (polygons)
  const TrailsLayer = new FeatureLayer({
    url: "https://services2.arcgis.com/DRQySz3VhPgOv7Bo/arcgis/rest/services/Glacier_National_Park_Trails/FeatureServer",
    title: "Trails",
    renderer: TrailsRenderer,
    opacity: 1.0,
    outFields: ["NAME","AREA","Miles", "DESC_SEG", "TRAILROUTE"],
    popupTemplate: popupTrails
  });
// Add the layer to the map
  map.add(TrailsLayer, 0);   
    
// Define a pop-up for GNP Boundary
   const popupGNPboundary = {
    "title": "<b>Glacier National Park Boundary</b>",
    //"content": "{NAME} <br><b><b>,{AREA},{Miles}, {DESC_SEG}, {TRAILROUTE}"
   }

   const GNPboundaryRenderer = {
    type: "simple",
    symbol: {
      color: "#000000", 
      type: "simple-line",
      style: "solid" 
    }
  };

  //Adding GNP Boundary feature layer (polygons)
  const GNPboundaryLayer = new FeatureLayer({
    url: "https://services5.arcgis.com/qq4v7PSRahj3ckMw/arcgis/rest/services/GNP_Boundary/FeatureServer",
    title: "Glacier National Park Boundary",
    renderer: GNPboundaryRenderer,
    opacity: 1.0,
   //outFields: //["NAME","AREA","Miles", "DESC_SEG", "TRAILROUTE"],
    popupTemplate: popupGNPboundary
    
   });
// Add the layer to the map
  map.add(GNPboundaryLayer, 0); 

 // Define a pop-up for Roads
   const popupRoads = {
    "title": "<b>Roads</b>",
    "content": "{ROADNAME} <br><b><b>,{ROADNUM},{ADMIN}, {SURFACE}"
    } 

   const RoadsRenderer = {
    type: "simple",
    symbol: {
      color:"#FFAA00",
      type: "simple-line",
      style: "solid",
      }
  };

  //Adding Roads feature layer (polygons)
  const RoadsLayer = new FeatureLayer({
    url: "https://geo.dot.gov/server/rest/services/Hosted/North_American_Roads_DS/FeatureServer",
    title: "Roads",
    renderer: RoadsRenderer,
    opacity: 1.0,
    outFields: ["ROADNAME","ROADNUM","ADMIN", "SURFACE"],
    popupTemplate: popupRoads
  });
// Add the layer to the map
  map.add(RoadsLayer, 0);   


   view.popup.dockEnabled = true
   view.popup.collapseEnabled = false
   view.popup.dockOptions = {
    breakpoint: false,
    buttonEnabled: true,
    position: 'bottom-right'
  }

  //Location Widget
  const locate = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: function(view, options) {
      options.target.scale = 1500;
      return view.goTo(options.target);
    }
  });

  //create editor panel (this is where you add the various layers that you will display)(adds picture attachment)------
  const editor = new Editor({
    view: view,
    // label: "Animal Sighting", 
    // allowedWorkflows: ["create", "update"], 
    layerInfos: [{
      //view: view,
      layer: animalSightingLayer,
      formTemplate: { //autocastable to FieldElement
      fieldConfig: [
        {
          name: "Species", 
          label: "Species"  
        },
        {
          name: "Date_Time",
          label: "Date"
        },
        {
          name: "Location_Desc",
          label: "Location"
        },
        { 
          name: "UserName",
          label: "User"
         }]},
      enabled: true, // default is true, set to false to disable editing functionality
      addEnabled: true, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: true, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: true, // default is true, set to false to disable the ability to delete features
      attributeUpdatesEnabled: true, // Default is true, set to false to disable the ability to edit attributes in the update workflow.
      geometryUpdatesEnabled: true, // Default is true, set to false to disable the ability to edit feature geometries in the update workflow.
      attachmentsOnCreateEnabled: true, //Default is true, set to false to disable the ability to work with attachments while creating features.
      attachmentsOnUpdateEnabled: true //Default is true, set to false to disable the ability to work with attachments while updating/deleting features.
    },
    
    {
      view: view,
      layer: trailHeadsLayer,
      enabled: false, // default is true, set to false to disable editing functionality
      addEnabled: false, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: false, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: false // default is true, set to false to disable the ability to delete features
    },
    {
      view: view,
      layer: RestRoomsLayer,
      enabled: false, // default is true, set to false to disable editing functionality
      addEnabled: false, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: false, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: false // default is true, set to false to disable the ability to delete features
    },
    {
      view: view,
      layer: viewPointsLayer,
      enabled: false, // default is true, set to false to disable editing functionality
      addEnabled: false, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: false, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: false // default is true, set to false to disable the ability to delete features
    },
    {
      view: view,
      layer: RangerStationLayer,
      enabled: false, // default is true, set to false to disable editing functionality
      addEnabled: false, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: false, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: false // default is true, set to false to disable the ability to delete features
    },
     {
      view: view,
      layer: PicnicAreasLayer,
      enabled: false, // default is true, set to false to disable editing functionality
      addEnabled: false, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: false, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: false // default is true, set to false to disable the ability to delete features
    },
     {
      view: view,
      layer: ParkingLayer,
      enabled: false, // default is true, set to false to disable editing functionality
      addEnabled: false, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: false, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: false // default is true, set to false to disable the ability to delete features
    },
     {
      view: view,
      layer: CampgroundsLayer,
      enabled: false, // default is true, set to false to disable editing functionality
      addEnabled: false, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: false, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: false // default is true, set to false to disable the ability to delete features
    },
     {
      view: view,
      layer: TrailsLayer,
      enabled: false, // default is true, set to false to disable editing functionality
      addEnabled: false, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: false, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: false // default is true, set to false to disable the ability to delete features
    },           
     {
      view: view,
      layer: GNPboundaryLayer,//GNPboundaryLayer
      enabled: false, // default is true, set to false to disable editing functionality
      addEnabled: false, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: false, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: false // default is true, set to false to disable the ability to delete features
    },
      {
      view: view,
      layer: RoadsLayer,
      enabled: false, // default is true, set to false to disable editing functionality
      addEnabled: false, // default is true, set to false to disable the ability to add a new feature
      updateEnabled: false, // default is true, set to false to disable the ability to edit an existing feature
      deleteEnabled: false // default is true, set to false to disable the ability to delete features
    }                    
   ]
  });

  //Editor Widget Functionality that allows for user submitted data
  editor.viewModel.watch('state', function(state){
    if(state === 'ready'){
      setTimeout(function(){
        document.getElementsByClassName('esri-editor__title esri-heading')[0].innerHTML = 'Animal Sightings'; // 'Bear Reports'
        var actions = document.getElementsByClassName("esri-editor__feature-list-name");
        Array.from(actions).forEach(function(ele){
          if(ele.innerHTML==='Add feature'){
            ele.innerHTML = 'Create New Animal Sighting'; //'Create New Bear Report'
          }
      	  if(ele.innerHTML==='Edit feature'){
            ele.innerHTML = 'Modify or Delete Existing Animal Sightings'; //'Modify or Delete Existing Bear Reports'
          }
        });
      }, 50); 
    }
  });

  // build in more links for animal information------------------------------------- Add one widget that creates a drop down for multiple sites if possible.
//   create node for content panel( could add the reservation.gov or the nps site here, change the "Every year..." for animal sightings  Andy)
  var node = domConstruct. create("div", {
    className: "myPanel",
    innerHTML: "<b>Animal Sightings at Glacier National Park</b><br>" + //"<b>Resident Portal Information Guide</b><br>" +
    '<a class="none" href="https://www.nps.gov/glac/learn/nature/mammals.htm" target="_blank"></a>' + //<img class="NPS" src="img/nps_logo.edit_2.jpg" alt="NPS" style="width:111px;height:42px;">
    "<p>Welcome to the Glacier National Park Animal Sightings Portal! The portal offers visitors and staff the ability to locate animal sightings in an interactive map, allowing park staff to respond to concerns about visitor and animal interactions in Glacier National Park.</p></b>" +
  //   '<a class="none" href="https://www.naperville.il.us/services/brush-leaf-and-yard-waste-collection/bulk-curbside-leaf-collection/" target="_blank"><img class="NPD" src="img/leaf4.jpg" alt="Prairie Crayfish" style="width:100px;height:60px;"></a></b>' +
  //   '<a class="none" href="https://app.powerbigov.us/view?r=eyJrIjoiNzlhMDgyOWQtYTBjMi00MzgwLWFiM2QtYjg3YTBhZjVlYjU5IiwidCI6ImI5YTBmOTlmLTRiZGUtNGI4MS04YjIxLWZjZWRkNDU4ZmVjNSJ9" target="_blank"><img class="NPD" src="img/icons8-graph-report-64.png" alt="NPD" style="width:64px;height:64px;"></a>' +
    "<p>Glacier National Park hosts 3 million visitors every year. This application was created to assist park staff with monitoring human and animal interactions within the park with the aim to encourage safe teachable interactions. <br> With your continued map contributions, we can make this an effective program that increases your safety and the safety of other visitors. </p></b>"
    });

    const purpose = new Expand({
     expandIconClass: "esri-icon-description",
     view: view,
     expanded: false,
     expandTooltip: "Application Purpose",
     content: node
    });

 // keep
    watchUtils.whenTrueOnce(purpose, 'expanded', function(){
     on(dom.byId("btnSubmit"), 'click', function(){
       console.log("submit clicked");
     });
    });
    
    function openLink() {
      const dropdown = document.getElementById("linkDropdown");
      const selectedValue = dropdown.value;
      
      if (selectedValue) {
        window.open(selectedValue, "_blank"); // Open the link in a new tab
        dropdown.selectedIndex = 0; // Reset dropdown to the default option
      }
    }
    
    document.addEventListener("DOMContentLoaded", function() {
      document.getElementById("linkDropdown").addEventListener("change", openLink);
    });
    
  //creating basemap widget and setting its container to a div
  var basemapGallery = new BasemapGallery({
   view: view,
   container: document.createElement("div")
  });

  //creates an expand instance and sets content properpty to DOM node of basemap gallery widget with an Esri
  //icon font to represent the content inside the expand widget
  var bgExpand = new Expand({
   view: view,
   content: basemapGallery,
   expandTooltip: "Change Basemap"
  });

  // close the expand whenever a basemap is selected
  basemapGallery.watch("activeBasemap", function() {
   var mobileSize = view.heightBreakpoint === "xsmall" || view.widthBreakpoint === "xsmall";

   if (mobileSize) {
     bgExpand.collapse();
   }
  });

  // Add the expand instance to the ui
  view.ui.add(bgExpand, "top-left");

  //create layer lists widget to make layers visible or invisible
  var layerList = new LayerList({
   view: view,
   // executes for each ListItem in the LayerList
   listItemCreatedFunction: function (event) {
  
     var item = event.item;

     if (item.title === "trailheadsLayer") { 
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Trail Heads"; //Address Points
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
     if (item.title === "RestRoomsLayers") { 
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "RestRooms"; 
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
     if (item.title === "ViewPointsLayer") { 
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "View Points"; 
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
    
     if (item.title === "animalSightingLayer") { //changes for animal sightings
      // open the list item in the LayerList
      item.open = true;
      // change the title to something more descriptive
      item.title = "Animal Sighting"; 
      //add legend
      item.panel = {
        content: "legend",
        open: true
      };
    }
     
     if (item.title === "RangerStationLayer") { 
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Ranger Stations";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
   if (item.title === "PicnicAreasLayer") { 
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Picnic Areas";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
   if (item.title === "ParkingLayer") { 
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Parking";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
   if (item.title === "CampgroundsLayer") { 
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Campgrounds";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
     if (item.title === "TrailsLayer") {
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Trails";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }  
     if (item.title === "GNPboundaryLayer") { //GNPboundaryLayer
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Glacier National Park Boundary";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
     if (item.title === "RoadsLayer") { 
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "US North American Roads";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
   } 
  });

  //adds expand button to map TRY TO CHANGE ICON AND WORDS OF EXPAND BOX
  layerListExpand = new Expand({
   expandIconClass: "esri-icon-layer-list",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
   // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
   view: view,
   content: layerList,
   expandTooltip: "Layer Visibility/Layer Legend"
  });

  view.ui.add(layerListExpand, "top-left");

  //adds expand button to map TRY TO CHANGE ICON AND WORDS OF EXPAND BOX
  editorExpand = new Expand({
   expandIconClass: "esri-icon-visible",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
 expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
   view: view,
   content: editor,
   expandTooltip: "Animal Sighting"  
  });

  view.ui.add(editorExpand, "top-left");

  //add location button to map
  view.ui.add(locate, "top-left");

  // Add the home button to the top left corner of the view
  view.ui.add(homeBtn, "top-left");

//pop up for Animal Sightings being searched (test 1 11/29/2024)
// var animalSightingSearch = new FeatureLayer({ 
//   url:
//     "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Animal_Sightings2/FeatureServer",//https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Animal_Sightings_1/FeatureServer",
//   popupTemplate: {
//     // autocasts as new PopupTemplate()
//     title: "Animal Sighting: {Species}", //"Bear Reports: {SUB_NAME} </br>Trees: {TREE_TOTAL} </br>Total Storm Drains: {STORM_TOTAL}",
//     overwriteActions: true
//   }
//  });

 
 // Disable the default popupTemplate behavior
//animalSightingLayer.popupTemplate = null;

 // Enable and configure popup docking
view.popup.dockEnabled = true;
view.popup.collapseEnabled = false;
view.popup.dockOptions = {
  breakpoint: false,
  buttonEnabled: true,
  position: "bottom-right" // Popup docked in the bottom-right corner
};
 
 
 //add search widget
  var searchWidget = new Search({
    view: view,
    allPlaceholder: "Enter Species or Username", 
    sources: [
      {
        layer: animalSightingLayer, //animalSightingSearch, 
        searchFields: ["Species"], 
        displayField: "Species", 
        exactMatch: false, //Allow partial matches
        outFields: ["*"], //["Species", "Date_Time", "Location_Desc", "UserName"], //Photos and files, see if you can search by username too. 
        name: "Search by Species",
        placeholder: "Enter Animal Species"
      },
      {
        layer: animalSightingLayer, //animalSightingSearch, 
        searchFields: ["UserName"], 
        displayField: "UserName", 
        exactMatch: false, //Allow partial matches
        outFields: ["*"],//["Species", "Date_Time", "Location_Desc", "UserName"], // Include fields you want to display
        name: "Search by Username",
        placeholder: "Enter Username"
      }
    ],
    includeDefaultSources: false//, //Exclude default ArcGIS World Geocoder
    
  });

  
  // Add the search widget to the top right corner of the view
  view.ui.add(searchWidget, {
    position: "top-right",
    width: "50%"
  });

  let highlightHandle; // Store the highlight handle for clearing later
  let isSearchPopup = false; // Flag to indicate whether the popup is showing search results 

// Handle search results
searchWidget.on("search-complete", function (event) {
  // Clear existing features in the popup
  //view.popup.close();

  // Clear any existing highlights
  if (highlightHandle) {
     highlightHandle.remove();
   }
   // Flatten search results across sources
   const results = event.results.flatMap((r) => r.results); // Flatten results from all sources
  
   // Check if any results were returned
  if (results.length > 0) {
    //const allFeatures = [];
    const features = results.map((result) => result.feature);

  // Highlight all results
    view.whenLayerView(animalSightingLayer).then((layerView)=> {
      highlightHandle = layerView.highlight(features);
    });

    // Zoom to extent of all results
    const geometries = features.map((feature) => feature.geometry);
    const extent = geometries.reduce((acc, geometry) => {
      return acc ? acc.union(geometry.extent) : geometry.extent;
    }, null);

    if (extent) {
      view.goTo(extent.expand(1.5)).catch((error) => {
        console.error("Error zooming to extent of results:", error);
      });
    }
    
    // Set the popup to display all results
    isSearchPopup = true; // Set the flag
    view.popup.open({
      features: features, // Add all features to the popup
      featureNavigationEnabled: true, // Allow navigation through results
      title: `Search Results (${features.length})`
    });

// Prevent the default popup from overriding the search results
view.popup.watch("visible", function (visible) {
  if (!visible) {
    isSearchPopup = false; // Exit search mode when the popup is closed
  }
});

// Stop automatic layer interactions from triggering new popups
view.on("click", (event) => {
  if (isSearchPopup) {
    event.stopPropagation();
  }
});
} else {
console.warn("No results found for the search query.");
view.popup.close(); // Ensure popup is closed when no results are found
}
});

// Reset the click handler after exiting search mode
view.popup.watch("visible", function (visible) {
if (!visible) {
isSearchPopup = false;
}
});


     // Set the popup to display all results
    //  isSearchPopup = true; // Set the flag
    //  view.popup.open({
    //    features: features, // Add all features to the popup
    //    featureNavigationEnabled: true, // Allow navigation through results
    //    title: `Search Results (${features.length})`
    //  });
 
//      // Prevent automatic selection changes in the popup
//      view.popup.watch("selectedFeatureIndex", function (index) {
//        if (isSearchPopup && index !== -1) {
//          // Force the popup to stop changing automatically
//          view.popup.selectedFeatureIndex = -1;
//        }
//      });
//     // Prevent automatic selection changes in the popup
//     // view.popup.watch("selectedFeature", function (selectedFeature) {
//     //   if (isSearchPopup) {
//     //     // Stop selection changes caused by the default behavior
//     //     view.popup.selectedFeatureIndex = -1;
//     //   }
//     // });

//     // Reset the flag after the popup is manually closed
//     view.popup.watch("visible", function (visible) {
//       if (!visible) {
//         isSearchPopup = false; // Reset the flag when popup is closed
//       }
//     });
//   } else {
//     console.warn("No results found for the search query.");
//     view.popup.close(); // Ensure popup is closed when no results are found
//   }
// });
//     // Display all search results as individual popup items
//     view.popup.open({
//       features: features, // All features added as popup items
//       featureNavigationEnabled: true, // Enable navigation between features
//       title: `Search Results (${features.length})`
//     });
//   } else {
//     console.warn("No results found for the search query.");
//     view.popup.close(); // Ensure popup is closed when no results are found
//   }
// });
//      // Open popup with multiple results
//      view.popup.open({
//       location: features[0].geometry, // Focus on the first result's location
//       title: `Search Results (${features.length})`,
//       content: features
//         .map(
//           (feature, index) =>
//             `<b>Result ${index + 1}:</b><br>` +
//             `<b>Species:</b> ${feature.attributes.Species || "N/A"}<br>` +
//             `<b>Date/Time:</b> ${feature.attributes.Date_Time || "N/A"}<br>` +
//             `<b>Location:</b> ${feature.attributes.Location_Desc || "N/A"}<br>` +
//             `<b>Username:</b> ${feature.attributes.UserName || "N/A"}<br><hr>`
//         )
//         .join("") // Combine all results in one popup
//     });
//   } else {
//     console.warn("No results found for the search query.");
//     view.popup.close(); // Ensure popup is closed when no results are found
//   }
// });
// Add a click event listener to handle feature popups outside search
view.on("click", (event) => {
  view.hitTest(event).then((response) => {
    const results = response.results.filter((result) => {
      return result.graphic && result.graphic.layer === animalSightingLayer;
    });

    if (results.length > 0) {
      const selectedFeature = results[0].graphic;

      // Open the popup for the clicked feature
      view.popup.open({
        location: event.mapPoint,
        features: [selectedFeature] // Open the popup for the selected feature
      });
    } else {
      view.popup.close(); // Close popup if no feature is found
    }
  });
});    

//Create a content string to display all attributes
    // const content = features
    //   .map(
    //     (feature, index) =>
    //       `<b>Result ${index + 1}:</b><br>` +
    //       `<b>Species:</b> ${feature.attributes.Species || "N/A"}<br>` +
    //       `<b>Date/Time:</b> ${feature.attributes.Date_Time || "N/A"}<br>` +
    //       `<b>Location:</b> ${feature.attributes.Location_Desc || "N/A"}<br>` +
    //       `<b>Username:</b> ${feature.attributes.UserName || "N/A"}<br><hr>`
    //   )
    //   .join("");
        
    // //if (allFeatures.length > 0) {
    //   // Display multiple features in the popup
    //     // Set the popup's location and content based on the result
    //     view.popup.open({
    //       //features: features, // Set all results as popup features
    //       //featureNavigationEnabled: true, // Enable navigation between features
    //       location: features[0].geometry, // Focus on the first result's location
    //       //location: result.feature.geometry, // Use the result's geometry
    //       title: `Search Results (${features.length})`,//"Search Results",
    //       content: content //"Navigate through the results to zoom and view details."//function () {
    //       });        
 
//  // Highlight all results
//  view.whenLayerView(animalSightingLayer).then(function (layerView) {
//   highlightHandle = layerView.highlight(features);
// });

// // Zoom to extent of all results
// const geometries = features.map((feature) => feature.geometry);
// const extent = geometries.reduce((acc, geometry) => {
//   return acc ? acc.union(geometry.extent) : geometry.extent;
// }, null);

// if (extent) {
//   view.goTo(extent.expand(12)).catch((error) => {
//     console.error("Error zooming to extent of results:", error);
//   });
// }

// // Add event listener for popup navigation
// view.popup.watch("selectedFeature", function (selectedFeature) {
//   if (selectedFeature) {
//     view.goTo({
//       target: selectedFeature.geometry,
//       zoom: 15 // Adjust zoom level for individual feature
//     }).catch((error) => {
//       console.error("Error zooming to selected feature:", error);
//     });
//   }
// });
// } else {
// console.warn("No results found for the search query.");
// }
// });
 
   view.ui.add(purpose, "top-right");

   // Add the animal information button to the map (try for the left corner of the view) 
  // view.ui.add(information, "top-left");
  view.ui.add("linkDropdownContainer", {
    position: "top-right",
    index: 8 // Higher index pushes it further down
  });
   
});
