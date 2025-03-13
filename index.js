// Variable identifiant le lieu de stockage des Pages
var PageLoc = "./Pages"

// Variables pour A-FRAME qui concerne la scène
var SceneData = $("a-scene")
var scene     = SceneData[0]
var MainScene = $("#MainScene")[0]

// Contiens le nom du document dans une variable
let PathName = location.pathname.split("/")
PathName = (PathName[PathName.length - 1].split(".")[0] || "index").toUpperCase()

//Fonction pour attendre x millisecondes
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// Fonction qui enlève le "cache" de la caméra
async function UpdateNavigator() {
    await sleep(100)
    $("#cur_camera")[0].emit("end_trans")
  }

// Interaction pour la fonction UpdateNavigator, quand la template est chargée
if(MainScene) MainScene.addEventListener("templaterendered", UpdateNavigator)

// Fonction qui change la scène en vue du nom donner
async function SwitchArea(Name) {
    let ok = document.querySelectorAll(".field")

    // Enlève tous les éléments de la classe "field" 
    ok.forEach(function(val) { $(val).remove() })

    $("#cur_camera")[0].emit("start_trans")
    await sleep(500)
  
    // Changement de la scène par la valeur du template
    MainScene.attributes.template.nodeValue = "src: " + PageLoc + "/" + PathName + "/" + Name + ".html"
}

// Initialisation de la scène
AFRAME.registerComponent('scene-init', {
    schema: {type: 'string', default: 'default'},
    init: async function() {
      this.SceneName = this.data

      SwitchArea(this.SceneName)
    }
  })  

// Boutton qui change la scène a la valeur prédéfinie
AFRAME.registerComponent('scene-changer', {
    schema: {type: 'string', default: 'default'},
  
    init: async function() {
      this.onClick = this.onClick.bind(this)
      this.SceneName = this.data

      // Active l'évènement si un click est détecté
      this.el.addEventListener("click", this.onClick)
    },
  
    onClick: async function() {
      SwitchArea(this.SceneName)
    }
  })

  AFRAME.registerComponent('tang', {
    schema: {
      angle: {type: 'int', default: 0},
      Y: {type: 'int', default: 1}
    },
  
    init: async function() {
      this.update = this.update.bind(this)
    },
  
    update: async function() {  
      console.log("update")
      // ------ \\
      let container = $("#navigation")[0]
      let angle = this.data["angle"] (180 / Math.PI), radius = container.getAttribute("radius-outer") * 4
      let x = ( radius ) * Math.cos(angle), z = ( radius ) * Math.sin(angle); 
    
      this.el.setAttribute("position", {"x": x, "y": container.getAttribute("position").y + this.data["Y"], "z": z})
      
      this.el.object3D.lookAt(container.getAttribute("position"))
      this.el.setAttribute("visible", "true")
    },
  })
