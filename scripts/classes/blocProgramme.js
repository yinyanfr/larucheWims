/*
 * Classe parente pour tous les blocs de programme
 * Un BlocProgramme est un ensemble d'instructions sous forme de bloc
 * Il peut être déplacé dans la partie "préparation"
 * TODO : également dans la partie analyse
 * Il faut faire dériver un bloc programme spécifique comme
 *    - définition de variable
 *    - boucle, si/alors, etc...
 *    - BlocProgramme
 */

BlocProgramme = function(num)
{
    //--------- ATTRIBUTS ---------//
    
    this.nom = "BlocProgramme"+num;    // nom de ce BlocProgramme
    this.numero = num;          // numéro de cet BlocProgramme parmi les BlocProgrammes de l'exercice
    this.proto = "BlocProgramme";      // nature de la classe parente
};

BlocProgramme.prototype.proto = "BlocProgramme"; // nature de la classe parente

    //--------- METHODES ----------//
        

BlocProgramme.prototype.initBloc = function()
/*
 * Initialisation d'un bloc BlocProgramme.
 * crée le bloc vide dans l'onglet préparation.
 * crée les boutons de suppression/déplacement/...
 */
{
 var bloc_pere = document.getElementById("Rid_Prep_Blocs");
 var liste = document.createElement("LI");
 liste.id = "RidPrBloc_"+this.nom;
 liste.className = "Rcl_Bloc_BlocProgramme Rcl_Bloc";
 var posDrag = document.createAttribute("posdrag");
 posDrag.value=0;
 bloc_pere.setAttributeNode(posDrag);
 
 /* début des modifs pour le drap and drop */
 liste.draggable = true;
 var posDrag=0;
 
    liste.addEventListener('dragstart', function(e) {
        
        if(bloc_pere.getAttribute("posdrag")==0){
                    bloc_pere.setAttribute("posdrag",""+e.clientY);
                }
        e.dataTransfer.setData('text/plain', liste.id);
        e.dataTransfer.setDragImage(dragImg, 40, 40); // Une position de 40x40 pixels centrera l'image (de 80x80 pixels) sous le curseur
        
    });

    var dragImg = new Image(); // On précharge l'image
    dragImg.src = 'drag_img.png';

    //On gère la réception
    liste.addEventListener('dragover', function(e) {
        e.preventDefault(); // Annule l'interdiction de drop
        if(e!=this)
            {
                if(bloc_pere.getAttribute("posdrag")<e.clientY)
        {
            this.style.borderBottom="2px dotted red";
        }
        else
        {
            this.style.borderTop="2px dotted red";
        }
            }
        console.log('Un élément survole la zone');
    });
    // On gère le changement d'apparence entre les deux fonctions. 
    
    liste.addEventListener('dragenter', function(e) {
         //Lorsqu'on entre dans la zone de drop
         console.log('Entrée dans zone !');
     });
                        
    liste.addEventListener('dragleave', function(e) {
         //Lorsqu'on sort d'une zone de drop.
        this.style.borderBottom="";      
        this.style.borderTop="";
        console.log('Sortie de zone');
     });
    
    

   liste.addEventListener('drop', function(e) {
        /*Cette fonction sert à décrire ce qui se passera pour le bloc ciblé ce qui se passera lorsqu'on lachera un objet droppable sur lui */
        
        this.style.borderBottom="";      
        this.style.borderTop="";
       if(bloc_pere.getAttribute("posdrag")!=""+0){
            bloc_pere.setAttribute("posdrag",0);
        }
        var nomZoneIn=" "; //on va récupérer l'id du bloc reçu. 
        nomZoneIn=e.dataTransfer.getData('text/plain'); // Affiche le contenu du type MIME « text/plain »
        console.log('Données reçu : ' + nomZoneIn);
        //Maintenant nous allons faire en sorte de changer de place le bloc si on passe sur le bloc avant ou après lui

        var id_drop = document.querySelector('#'+nomZoneIn);
        //var li = buttonHaut.parentNode.parentNode;

        // On va gérer le précédent
        var previous = id_drop.previousElementSibling;//l'élément précédent le bloc droppé
       
        var next = id_drop.nextElementSibling;//l'élément suivant le bloc droppé

       var lgNext= BlocProgramme.prototype.trouverSuivant(id_drop,this); //Permet de donner à cb de cases se trouve le bloc ciblé wxc
        var lgPrev=0;
        console.log('Oui, vous avez bien entendu, '+lgNext+' blocs plus loin')


        var lgPrev= BlocProgramme.prototype.trouverPrecedent(id_drop,this);
        //var actu= id_drop;
        if(lgNext>0)
        {
            console.log("Et ca, ca permet d'entrer dans la fonction de déplacement du suivant");
           
            for (var i = 0; i < lgNext; i++) { //on fait faire au bloc droppé lgNext descentes vers le bas.
                
                if(next){
                    next = next.nextElementSibling;

                    console.log('Un bloc suivant a été trouvé ! Changement...');
                    id_drop.parentNode.insertBefore(id_drop, next);
                    var nom = id_drop.id.slice("RidPrBloc_".length,id_drop.id.length);
                
                    var ind = rucheSys.rechercheIndice(nom,rucheSys.listeBlocPrepa);
                
                    var temp = rucheSys.listeBlocPrepa[ind];
                    rucheSys.listeBlocPrepa[ind] = rucheSys.listeBlocPrepa[ind+1];
                    rucheSys.listeBlocPrepa[ind+1] = temp;
           
            
                }
                else
                {
                    console.log("Fin du next");
                }

                //On change visuellement la place. 
                
                }
            }

        if (lgPrev) {
            for(var j=0; j< lgPrev;j++)
            {
             if (previous) {
                    console.log('Un bloc precedent a été trouvé ! Changement...');
                    id_drop.parentNode.insertBefore(id_drop, previous);
                    var nom = id_drop.id.slice("RidPrBloc_".length,id_drop.id.length);
                
                    var ind = rucheSys.rechercheIndice(nom,rucheSys.listeBlocPrepa);
                
                    var temp = rucheSys.listeBlocPrepa[ind];
                    rucheSys.listeBlocPrepa[ind] = rucheSys.listeBlocPrepa[ind-1];
                    rucheSys.listeBlocPrepa[ind-1] = temp;
                    previous = id_drop.previousElementSibling;
                }
                else
                {
                    console.log('Pas de précédent, désolé !');
                }
            }
        }
       
        else
        {
            console.log('Ni suivant, ne précédent !***********************');
        }
            console.log(this.id);
        });

    
    
    this.divBloc = document.createElement("DIV");
    this.divBloc.className = "Rcl_Bloc_Interne";

    /* Bouton de suppression */
    var buttonSuppr = document.createElement('button');
    buttonSuppr.id = "Rid_Button_Delete_" + this.nom;
    buttonSuppr.className = "Rcl_Button_Delete";
    buttonSuppr.onclick = function(){
      // supprime le bloc, ainsi que toute trace dans le tableau
        var n = liste.id.slice("RidPrBloc_".length,liste.id.length); //n est le nom+numero (BlocProgrammexxx) de l'BlocProgramme
        var indBlocProgrammeCible = rucheSys.rechercheIndice(n,rucheSys.listeBlocPrepa);
//        rucheSys.supprInstruction(n,rucheSys.listeBlocPrepa);
        BlocProgramme.prototype.detruitBloc.call(rucheSys.listeBlocPrepa[indBlocProgrammeCible]);
        
    }

    // Bouton pour diminuer / agrandir la fenêtre
    var buttonWindow = document.createElement('button');
    buttonWindow.id ="Rid_Button_MiniMaxi_"+this.nom;
    buttonWindow.className = "Rcl_Button_Minimize";
    buttonWindow.addEventListener('click', function (event)
    {
        if (buttonWindow.className == "Rcl_Button_Minimize")
        {
            buttonWindow.className = "";
            buttonWindow.className = "Rcl_Button_Maximize";
            buttonWindow.parentNode.parentNode.className = "Rcl_Bloc_BlocProgramme Rcl_Closed";
        }
        else
        {
            buttonWindow.className = "";
            buttonWindow.className = "Rcl_Button_Minimize";
            buttonWindow.parentNode.parentNode.className = "";
            buttonWindow.parentNode.parentNode.className = "Rcl_Bloc_BlocProgramme Rcl_Bloc";
        };
    },
    true);
    
    /* Bouton de deplacement vers le haut*/
    var buttonHaut = document.createElement('button');
    buttonHaut.id = "Rid_Button_Up_"+this.nom;
    buttonHaut.className = "Rcl_Move_Up_Arrow";
    buttonHaut.addEventListener('click', function (event)
    {
        var li = buttonHaut.parentNode.parentNode;
        var previous = li.previousElementSibling;
        if (previous) {
            li.parentNode.insertBefore(li, previous);
            var nom = li.id.slice("RidPrBloc_".length,li.id.length);
            
            var ind = rucheSys.rechercheIndice(nom,rucheSys.listeBlocPrepa);
            
            var temp = rucheSys.listeBlocPrepa[ind];
            rucheSys.listeBlocPrepa[ind] = rucheSys.listeBlocPrepa[ind-1];
            rucheSys.listeBlocPrepa[ind-1] = temp;
        }
    },
    true);
    
    /* Bouton de deplacement vers le bas*/
    var buttonBas = document.createElement('button');
    buttonBas.id = "Rid_Button_Down_"+this.nom;
    buttonBas.className = "Rcl_Move_Down_Arrow";
    buttonBas.addEventListener('click', function (event) {
        var li = buttonBas.parentNode.parentNode;
        var next = li.nextElementSibling;
        if (next) {
            next = next.nextElementSibling;
            var nom = li.id.slice("RidPrBloc_".length,li.id.length);
            
            var ind = rucheSys.rechercheIndice(nom,rucheSys.listeBlocPrepa);
            
            var temp = rucheSys.listeBlocPrepa[ind];
            rucheSys.listeBlocPrepa[ind] = rucheSys.listeBlocPrepa[ind+1];
            rucheSys.listeBlocPrepa[ind+1] = temp;
        }
        li.parentNode.insertBefore(li, next);
    },
    true);
    
    /* Bouton d'aide */
    if (this.aUneAide==true) {
        var buttonAide = document.createElement('button');
        buttonAide.id = "aide"+this.nom;
        buttonAide.className = "Rcl_Button_Help_Close";
        buttonAide.addEventListener('click', function (event)
        {
            var divAideNom = buttonAide.id.slice("aide".length,buttonAide.id.length);
            if (buttonAide.className == "Rcl_Button_Help_Open") {
                buttonAide.className = "";
                buttonAide.className = "Rcl_Button_Help_Close";
                $("#divAide"+divAideNom).toggleClass("Rcl_Help_Closed",true);
    //            buttonAide.parentNode.parentNode.className = "Rcl_Bloc_BlocProgramme Rcl_Bloc closed";
            }
            else
            {
                buttonAide.className = "";
                buttonAide.className = "Rcl_Button_Help_Open";
                $("#divAide"+divAideNom).toggleClass("Rcl_Help_Closed",false);
    //            buttonAide.parentNode.parentNode.className = "";
    //            buttonAide.parentNode.parentNode.className = "Rcl_Bloc_BlocProgramme Rcl_Bloc";
            }
        },
        true);
    }
    
    // Fabrication du contenu du bloc
    
    this.divBloc.appendChild(buttonSuppr);
    this.divBloc.appendChild(buttonWindow);
    this.divBloc.appendChild(buttonHaut);
    this.divBloc.appendChild(buttonBas);
    if (this.aUneAide==true) {
        this.divBloc.appendChild(buttonAide);
    }

    liste.appendChild(this.divBloc);
    if (this.aUneAide==true) {
        liste.appendChild(this.aideInit());
    }
    bloc_pere.appendChild(liste);
    if (this.aUneAide==true) {
        this.aideMenuInit();
    }
}

BlocProgramme.prototype.aideInit = function()
/*
 * Construction de la partie "aide" du bloc BlocProgramme.
 * Cette aide vient normalement en dernière position, après les éléments
 * du bloc. Mais les classes filles peuvent mettre l'aide
 * où bon leur semble. Voir exemple dans l'BlocProgramme "Dessinflydraw".
 * sortie :     - element DIV contenant l'aide
 */
{
    var divAide = $("<div>", {
                    id: "divAide"+this.nom,
                    class: "Rcl_Help_BlocProgramme Rcl_Help_Closed"
                    });
    divAide.css("overflow","hidden");   // pour empêcher les éléments flottants
                                        // (le menu) de dépasser du div
    return divAide[0];
}

BlocProgramme.prototype.aideMenuInit = function(zNodes,elementsAide)
/*
 * Construction de la liste (menu) des éléments d'aide.
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * parametre(s) :       - zNodes : liste des noeuds cliquables (objet JSON).
 *                                      leur id doivent être dans l'ordre 1,2,..N
 *                      - elementsAide : tableau des chaines (html) contenant les aides.
 *                                      l'ordre est le même que les noeuds zNodes
 *                                      (l'id du noeud est l'indice de l'aide dans le tableau
 */
{
    // Initialisation des paramètres du menu zTree
    var curMenu = null, zTree_Menu = null;
    var settings = {
    view: {
				showLine: false,
				showIcon: false,
				selectedMulti: false,
				dblClickExpand: false,
				addDiyDom: this.aideAddDiyDom
    },
    data: {
				simpleData: {
                enable: true
                }
    },
    callback: {
				beforeClick: this.aidePreClickMenu,
                onClick:this.aideClickMenu
    }
    };
    
    // Si pas de liste en entrée, fabrique une liste de test
    if (typeof zNodes =='undefined')
    {
        zNodes = [
                  {idAide:1, id:1, pId:0, name:"Première instance", open: true},
                  {idAide:2, id:2, pId:1, name:"Deuxième aide"},
                  {idAide:3, id:3, pId:1, name:"Lumière dans la nuit"},
                  {idAide:4, id:4, pId:3, name:"Tilt !!!!"},
                  {idAide:5, id:5, pId:3, name:"Et nous ?"},
                  {idAide:6, id:6, pId:5, name:"Fonction f( .. )"},
                  {idAide:7, id:7, pId:1, name:"Fin..."},
                  {idAide:8, id:8, pId:1, name:"Fin 2..."},
                  {idAide:9, id:9, pId:1, name:"Fin 3..."},
                  {idAide:10, id:10, pId:1, name:"Et puis zut, pas la fin !"},
                  {idAide:11, id:11, pId:1, name:"shuffle( .. )"},
                  {idAide:12, id:12, pId:1, name:"random()"},
        ];
    }
    
    this.zNodesAide = zNodes;
    
    if (typeof elementsAide=='undefined')
    {
        this.elementsAide = [];
        for (var i=0; i<zNodes.length; i++)
        {
            var chaineAide = "<div class=\"Rcl_Help_Title\"> Aide sur "+zNodes[i].name+"</div>";
            chaineAide += "<div>Test d'aide, l'identificateur de l'item est : "+zNodes[i].id+"</div>";
            chaineAide += "<div>Test d'aide, l'identificateur du parent de l'item est : "+zNodes[i].pId+"</div>";
            this.elementsAide.push(chaineAide);
        }
    }
    else
    {
        this.elementsAide = elementsAide;
    }
    
    // Fabrication du menu zTree
    
    var treeObj = $("<ul>", {
                    id: "aideMenu"+this.nom,
                    class: "ztree"
                    });
    var divAide = $("#divAide"+this.nom);
    divAide.prepend(treeObj);
    
    $.fn.zTree.init(treeObj, settings, this.zNodesAide);
    zTree_Menu = $.fn.zTree.getZTreeObj("aideMenu"+this.nom);
    curMenu = zTree_Menu.getNodes()[0];
    zTree_Menu.selectNode(curMenu);
    
    treeObj.hover(function () {
        if (!treeObj.hasClass("showIcon")) {
            treeObj.addClass("showIcon");
        }
    }, function() {
        treeObj.removeClass("showIcon");
    });
    
    // Affichage du premier élément
    divAide.append(this.elementsAide[0]);
    
}


BlocProgramme.prototype.aideAddDiyDom = function(treeId, treeNode)
/*
 * Fonction de callback "addDiyDom" du menu zTree
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * Personalisation de l'apparence du noeud de menu zTree
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 */
{
    var spaceWidth = 20; // ajoute des espaces à chaque niveau si le noeud n'est pas de niveau 0
    var switchObj = $("#" + treeNode.tId + "_switch"), icoObj = $("#" + treeNode.tId + "_ico");
    switchObj.remove();
    icoObj.before(switchObj);
    
    if (treeNode.level > 0) {
        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
        switchObj.before(spaceStr);
    }
}

BlocProgramme.prototype.aidePreClickMenu = function(treeId, treeNode)
/*
 * Fonction de callback "beforeClick" du menu zTree
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * Extension des menus de niveau inférieur à 0 si on clique SUR L'ITEM
 * et pas seulement sur le triangle
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 */
{
    if (treeNode.level == 0 ) {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        zTree.expandNode(treeNode);
    }
    return true;
}

BlocProgramme.prototype.aideClickMenu = function(event, treeId, treeNode, clickFlag)
/*
 * Fonction de callback "onClick" du menu zTree
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * Affiche l'aide si clique sur le menu
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 */
{
//    console.log("click sur élément "+treeNode.id+" de menu "+treeId);
    var nomBlocProgramme = treeId.slice("aideMenu".length,treeId.length);
    var ind = rucheSys.rechercheIndice(nomBlocProgramme,rucheSys.listeBlocPrepa);
    var BlocProgramme = rucheSys.listeBlocPrepa[ind];
    $("#"+treeId).nextAll().remove();
    $("#"+treeId).parent().append(BlocProgramme.elementsAide[treeNode.idAide-1]);
}


BlocProgramme.prototype.menuDeroulInit = function(elemId, zNodes, classesItems)
/*
 * Initialisation d'un menu déroulant. Il peut y en avoir plusieurs.
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * parametre(s) :       - elemId : id de l'élément en dessous duquel on met le menu.
 *                      - zNodes : liste des noeuds cliquables (objet JSON).
 *                                      leur id doivent être dans l'ordre 1,2,..N
 *                      - classesItem : tableau des classes de composants
 */
{
    BlocProgramme.nbMenuDeroul++; // nouveau menu...
    BlocProgramme.classeItemMenuDeroul.push(classesItems); // enregistre le tableau des classes de composants
    
    // Construction du div contenant le menu. C'est lui qui sera invisible au départ
    // Voir les fonctions BlocProgramme.prototype.showMenu() et hideMenu()
    var divMenuDeroul = $("<div>", {
                    id: "divMenuDeroul"+this.nom+"_"+BlocProgramme.nbMenuDeroul,
                    class: "menuContent",
                    style: "display: none; position: absolute;"
        });
    
    // Initialisation des paramètres du menu zTree
    var curMenu = null, zTree_Menu = null;
    var settings = {
    view: {
				showLine: false,
				showIcon: false,
				selectedMulti: false,
				dblClickExpand: false,
				addDiyDom: this.menuDeroulAddDiyDom
    },
    data: {
				simpleData: {
                enable: true
                }
    },
    callback: {
				beforeClick: this.menuDeroulPreClickMenu,
                onClick: this.menuDeroulClickMenu
    }
    };
    
    // Si pas de liste en entrée, fabrique une liste de test
    if (typeof zNodes =='undefined')
    {
        zNodes = [
                       { id:1, pId:0, name:"Liste composants 1", open: true},
                       { id:2, pId:1, name:"Composant 1"},
                       { id:3, pId:1, name:"Sous liste composants"},
                       { id:4, pId:3, name:"Composant S1"},
                       { id:5, pId:3, name:"Composant S2"},
                       { id:6, pId:3, name:"Composant S3"},
                       { id:7, pId:1, name:"Composant 2"},
                       { id:8, pId:1, name:"Composant 3"},
                       { id:9, pId:1, name:"Composant 4"},
                       { id:10, pId:1, name:"Composant 5"},
                       { id:11, pId:1, name:"Composant 6"},
                       { id:12, pId:1, name:"Composant 7"},
                       ];
    }
    
    // Fabrication du menu zTree
    
    var idMenu = "menuDeroul"+this.nom+"_"+BlocProgramme.nbMenuDeroul;
    var treeObj = $("<ul>", {
                    id: idMenu,
                    class: "ztree ztreeMenuDeroul",
                    style: "margin-top: 0; width:160px;"
                    });
//    treeObj.css("overflow","hidden"); // pas de barre de défilement
    divMenuDeroul.append(treeObj); // la position du div est en "absolute"
    var pElem = $("#"+elemId);
    $("body").append(divMenuDeroul);
    
    $.fn.zTree.init(treeObj, settings, zNodes);
    zTree_Menu = $.fn.zTree.getZTreeObj(idMenu);
    curMenu = zTree_Menu.getNodes()[0];
    zTree_Menu.selectNode(curMenu);
    
    treeObj.hover(function () {
                  if (!treeObj.hasClass("showIcon")) {
                  treeObj.addClass("showIcon");
                  }
                  }, function() {
                  treeObj.removeClass("showIcon");
                  });
    
    return idMenu;
}

BlocProgramme.prototype.menuDeroulIdFind = function(iMenuDeroul)
/*
 * Trouve l'id du menu deroulant numero iMenuDeroul de l'BlocProgramme courant
 * parametre(s) :   - iMenuDeroul : numero du menu deroulant dans l'BlocProgramme (convention décidée par le développeur)
 */
{
    kMenuDeroul = 0;
    var regex = new RegExp(this.nom);
    for (var i=0;i<this.idMenusDeroulants.length;i++)
    {
        if (regex.test(this.idMenusDeroulants[i])) {
            kMenuDeroul++;
            if (kMenuDeroul == iMenuDeroul) {
                return this.idMenusDeroulants[i];
            }
        }
    }
    return null;
}

BlocProgramme.prototype.menuDeroulShow = function(menuId, parentId)
/*
 * Montre un menu déroulant (le fait apparaître).
 * parametre(s) :       - menuId : id du menu
 *                      - parentId : id de l'élément en dessous duquel le menu apparaît
 */
{
    var parentObj = $("#"+parentId);
    var menuOffset = parentObj.offset();
    $("#"+menuId).parent().css({left:menuOffset.left + "px", top:menuOffset.top + parentObj.outerHeight() + "px"}).slideDown("fast");
    
    // le prochain click n'importe où fera disparaître le menu
    $("body").bind("mousedown", BlocProgramme.prototype.menuDeroulClicBodyCache);
}

BlocProgramme.prototype.menuDeroulHide = function()
/*
 * Cache tous les menus déroulants (les fait disparaître).
 */
{
    $("[id^=divMenuDeroul]").fadeOut("fast");
    $("body").unbind("mousedown", BlocProgramme.prototype.menuDeroulClicBodyCache);
}

BlocProgramme.prototype.menuDeroulClicBodyCache = function(event)
/*
 * Cache un menu déroulant sur un click en dehors du menu.
 */
{
    // Laisse le menu si clic dedans ou sur le bouton
    if ( !(typeof $(event.target).parents(".menuContent")[0] != 'undefined' || $(event.target)[0].class == "Rcl_Editor_Button_Composant")) {
        BlocProgramme.prototype.menuDeroulHide.call(this);
    }
}

BlocProgramme.prototype.menuDeroulPreClickMenu = function(treeId, treeNode)
/*
 * Fonction de callback "beforeClick" des menus déroulants
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 * Fonction virtuelle, doit être surchargée dans la classe fille
 */
{
//    console.log("pre-click sur élément "+treeNode.id+" de menu "+treeId);
}


BlocProgramme.prototype.menuDeroulClickMenu = function(event, treeId, treeNode, clickFlag)
/*
 * Fonction de callback "onClick" des menus déroulants
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 *                      - clickFlag : le noeud est sélectionné ou non (si checkbox activé). Ne nous sert pas ici
 * Fonction virtuelle, doit être surchargée dans la classe fille
 */
{
//    console.log("click sur élément "+treeNode.id+" de menu "+treeId+", clickFlag = "+clickFlag);
    
    // récupère le numéro du menu déroulant, qui est le numéro derrière le "_" à la fin de treeId
    var numMenuDeroul = treeId.match(/_[0-9]*$/)[0];
    numMenuDeroul = numMenuDeroul.slice(1,numMenuDeroul.length);
    
    // récupère l'BlocProgramme
    var nomBlocProgramme = treeId.slice("menuDeroul".length,treeId.length);
    nomBlocProgramme = nomBlocProgramme.slice(0,-numMenuDeroul.length-1);
    var ind = rucheSys.rechercheIndice(nomBlocProgramme,rucheSys.listeBlocPrepa);
    var BlocProgramme = rucheSys.listeBlocPrepa[ind];
    
    // cache le menu lorsqu'on a cliqué
    BlocProgramme.menuDeroulHide();
    
    // Fait exécuter l'action commandée par l'BlocProgramme
    // pour le moment, il n'y a que des "composants"
    // qui sont pointés par des actions de menus déroulants
    var classeComposant = (BlocProgramme.classeItemMenuDeroul[numMenuDeroul-1])[treeNode.idAction];
    
    // Appel de la méthode "nouveauComposant" de la classe BlocProgramme fille...
    // ... qui devrait savoir quoi en faire
    BlocProgramme.nouveauComposant(classeComposant);
}


BlocProgramme.prototype.nouveauComposant = function(classeComposant)
/*
 * construit un nouveau composant de classe "classeComposant"
 * correspondant à cet BlocProgramme
 */
{
    // par exemple (dans classe dérivée...
    // va s'enregistrer dans l'objet système rucheSys
    // rucheSys.ajoutComposantBlocProgramme(nomEdit, classeComposant)
}


BlocProgramme.prototype.menuDeroulAddDiyDom = function(treeId, treeNode)
/*
 * Fonction de callback "addDiyDom" des menus déroulants
 * Utilisation du plugin jquery zTree : http://www.ztree.me/
 * Personalisation de l'apparence du noeud de menu zTree
 * parametre(s) :       - treeId : id du menu zTree
 *                      - treeNode : noeud du menu
 */
{
    var spaceWidth = 10; // ajoute des espaces à chaque niveau si le noeud n'est pas de niveau 0
    var switchObj = $("#" + treeNode.tId + "_switch"), icoObj = $("#" + treeNode.tId + "_ico");
    switchObj.remove();
    icoObj.before(switchObj);
    
    if (treeNode.level > 0) {
        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
        switchObj.before(spaceStr);
    }
}


BlocProgramme.prototype.initEnonce = function()
/*
 * Initialisation de la partie "énoncé" de l'BlocProgramme
 * ajoute un bouton dans la liste d'BlocProgrammes
 * Voir dans l'BlocProgramme "QCM" l'exemple d'une surcharge de cette fonction
 */
{
    var tab = document.getElementById('Rid_Enonce_BlocProgrammes_List');
    var li = document.createElement('li');
    li.id = "RidEnEs_"+this.nom;
    
    // Bouton ajouté dans la liste des "actions d'BlocProgramme" de l'énoncé
    var bouton = document.createElement('button');
    bouton.id = "boutonBlocProgrammeEnonce"+this.nom;
    bouton.className = "Rcl_Surligne_BlocProgramme";
    
    /* Modif 2016 : mise en place du drag and drop */
    bouton.draggable = true; //Permet de rendre le boutton déplacable.

    //permet d'envoyer des données à la zone de drop
    bouton.addEventListener('dragstart', function(e) {

        e.dataTransfer.setData("texte", bouton.id);
        
    });

    //clonedElement = draggedElement.cloneNode(true);  //On fais en sorte que l'élément soit cloné
    /* Fin des modifs */
    var txt = document.createTextNode( this.nom );
    bouton.appendChild(txt);
    
    bouton.onclick = function(){
        nomBlocProgramme = li.id.slice("RidEnEs_".length,li.id.length); // On supprime le "liBlocProgramme" devant le nom de la variable
        var ind = rucheSys.rechercheIndice(nomBlocProgramme,rucheSys.listeBlocPrepa);
        
        // Si gère réponse, ne peut pas créer deux images "BlocProgramme" à la fois
        if (rucheSys.listeBlocPrepa[ind].gereReponse == true)
        {
            // recherche si image BlocProgramme existe déjà
            if (document.getElementsByClassName("nomBlocProgramme"+rucheSys.listeBlocPrepa[ind].nom).length == 0)
            {
                rucheSys.listeBlocPrepa[ind].initEnonceVersAnalyse(); // ajoute une réponse correspondant à l'BlocProgramme
                rucheSys.enonce.ajoutImageBlocProgramme(rucheSys.listeBlocPrepa[ind]);
            }
            else
            {
                alert("Cet BlocProgramme gère une réponse. Il ne peut en gérer plusieurs");
            }
        }
        else
        {
            rucheSys.enonce.ajoutImageBlocProgramme(rucheSys.listeBlocPrepa[ind]);
        }
    }

    li.appendChild(bouton);
    tab.appendChild(li);
    
}


BlocProgramme.prototype.initEnonceVersAnalyse = function()
/*
 * Initialisation de la partie "analyse" de l'BlocProgramme
 * lorsqu'on clique sur le bouton "BlocProgramme" de l'énoncé
 * de façon générique, ajoute un bloc réponse dans l'onglet "Analyse"
 * peut aussi faire des tas d'autres choses dans les BlocProgrammes dérivés
 * Voir dans l'BlocProgramme "QCM" l'exemple d'une surcharge de cette fonction
 */
{
    rucheSys.ajoutReponseBlocProgramme(this);
}


BlocProgramme.prototype.initAnalyse = function()
/*
 * Initialisation de la partie "analyse" de l'BlocProgramme
 * de façon générique, ne fait rien
 * Voir dans l'BlocProgramme "QCM" l'exemple d'une surcharge de cette fonction
 */
{
    console.log("BlocProgramme virtuel "+this.nom+", initialisation de la partie Analyse");
}

BlocProgramme.prototype.sauveEtatInterfaceReponse = function()
/*
 * Sauvegarde l'état de l'interface du bloc réponse dans les variables internes
 * de l'BlocProgramme. Sert juste avant la sauvegarde, permet de rétablir l'état au rechargement
 */
{
    // fonction virtuelle ici
}

BlocProgramme.prototype.chargeEtatInterfaceReponse = function(elem)
/*
 * Chargement de l'état de l'interface du bloc réponse depuis les variables de l'objet JSON elem
 * parametre(s) :    - elem : objet JSON
 */
{
    // fonction virtuelle ici
}

BlocProgramme.prototype.sauveEtatInterface = function()
/*
 * Sauvegarde l'état de l'interface du bloc BlocProgramme (boutons éventuels, sélecteurs...)
 * dans les variables internes de l'BlocProgramme.
 * Sert juste avant la sauvegarde, permet de rétablir l'état au rechargement
 */
{
    // fonction virtuelle ici
}

BlocProgramme.prototype.creerBloc = function(dataRecup)
/*
 * Méthode qui permet de créer un bloc BlocProgramme dans l'onglet préparation
 * fonction générique, ne crée "que" le div cadre,
 * les boutons de suppression, déplacement du bloc, etc...
 * à utiliser dans l'BlocProgramme dérivé (voir exemple QCM)
 * dataRecup : contient l'élément éventuel sauvegardé
 */
{
    this.initBloc();
    
    var titreBloc = document.createElement("DIV");
    var txt = document.createTextNode("BlocProgramme virtuel");
    titreBloc.appendChild(txt);
    titreBloc.style.textAlign="center";

    this.divBloc.appendChild(titreBloc);
    
    this.initEnonce();
    
    this.initAnalyse();
}


BlocProgramme.prototype.chargeEtat = function(elem)
/*
 * Chargement de l'état de l'objet depuis les variables de l'objet JSON elem
 * parametre(s) :    - elem : objet JSON
 */
{
    // fonction virtuelle ici
}


BlocProgramme.prototype.creerBlocReponse = function(dataRecup)
/*
 * Création d'un bloc réponse dans l'onglet analyse
 * géré par cet BlocProgramme.
 * paramètre(s) :       - dataRecup : données éventuelles pour le chargement à partir d'une sauvegarde
 *
 * fonction générique, ne crée "que" le div cadre,
 * les boutons de base du bloc, etc...
 * pas de bouton de suppression, il faut que l'BlocProgramme s'en charge
 * si c'est nécessaire... ou pas !
 * à surcharger dans l'BlocProgramme dérivé (voir exemple QCM)
 */
{
    // Récupère le div du bloc réponse
    var listeBloc = document.getElementsByClassName("divRep"+this.nom);
    var bloc = listeBloc[0];
    
    var titreBloc = document.createElement("DIV");
    var txt = document.createTextNode("Réponse envoyée par l'BlocProgramme "+this.nom);
    titreBloc.appendChild(txt);
    titreBloc.style.textAlign="center";
    
    bloc.appendChild(titreBloc);
}


BlocProgramme.prototype.detruitBloc = function()
/*
 * Destruction du bloc et de toutes les dépendances (boutons, réponses...)
 *
 * *********** ATTENTION : si d'autres variables sont définies par la classe fille,
 * ***********             les détruire dans celle-ci  ********
 *
 *
 */
{
    rucheSys.supprInstruction(this.nom,rucheSys.listeBlocPrepa);
    if ( document.getElementById("RidEnEs_"+this.nom) != null ) {
        document.getElementById("RidEnEs_"+this.nom).remove();
    }
    
    // Destruction des images correspondantes dans les éditeurs.
    if (!(this.gereReponse))
    {
        $("img.nomBlocProgramme"+this.nom).remove();
    }
    
    // Destruction du bouton énoncé lié à l'BlocProgramme
    $("li#RidEnEs_"+this.nom).remove();
    
    // Destruction de la réponse
    if (this.gereReponse)
    {
        this.supprimeReponse(this.chercheNomReponse());
    }
    
}

BlocProgramme.prototype.supprimeReponse = function(id)
/*
 * Suppression d'une réponse liée à un BlocProgramme.
 * Si d'autres variables sont définies dans la classe fille et associées
 * à la réponse (par exemple des éditeurs), elles devront être détruites
 * dans cette classe fille.
 * parametres - id : id de la réponse à supprimer, de la forme "reponseXXXX"
 */
{
    // supprime la réponse dans la liste des réponses
    var indice = rucheSys.rechercheIndice(id, rucheSys.listeReponse);
    
    if (indice<0) // si réponse pas encore affichée
    {
        return;
    }
    
    rucheSys.listeReponse.splice(indice, 1);
    
    // supprime le bloc html
    var idBlocRepAnalyse = "#RidAnBlocRep_"+id;
    $(idBlocRepAnalyse).remove();  // détruit le bloc
    
    // supprime l'image si elle existe dans l'éditeur principal
    $("img#"+id).remove();
    
    // remet l'avertissement si plus de réponse
    if (rucheSys.listeReponse.length==0)
    {
        $("#Rid_Warning_No_Answer").css('display','inline-block');
    }
    
    rucheSys.verifReponse(); // reordonne les réponses restantes
}


BlocProgramme.prototype.chercheNomReponse = function()
/*
 * Récupère le nom de la réponse gérée par cet BlocProgramme si il existe.
 */
{
    var nomRep = "";
    if (!(this.gereReponse)) {
        return nomRep;
    }
    
    // teste toutes les réponses pour savoir laquelle est gérée par cet BlocProgramme
    
    for (var i=0; i<rucheSys.listeReponse.length; i++)
    {
        if (rucheSys.listeReponse[i].format != null) {
            if (rucheSys.listeReponse[i].format.nomBlocProgrammeGerant == this.nom)
            {
                var nomRep = rucheSys.listeReponse[i].format.nom;
            }
        }
    }
    return nomRep;
}


//---------------------------------//
    
    BlocProgramme.prototype.reduireBloc = function()
    {
        console.log(this.nom);
        if(document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className=="Rcl_Button_Minimize")
        {
            document.getElementById("RidPrBloc_"+this.nom).className = "Rcl_Bloc_BlocProgramme Rcl_Closed";
            document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className="Rcl_Button_Maximize";
            
        }
    }
    
    BlocProgramme.prototype.agrandirBloc =function()
    {
        if(document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className=="Rcl_Button_Maximize")
            {
                document.getElementById("Rid_Button_MiniMaxi_"+this.nom).className= "Rcl_Button_Minimize";
                document.getElementById("RidPrBloc_"+this.nom).className = "Rcl_Bloc_BlocProgramme Rcl_Bloc";
            }
    }


	

	//---------------------------------//


BlocProgramme.prototype.toOEF = function()
/*
 * Fonction qui permet de générer le code OEF de l'BlocProgramme, partie préparation
 * retourne une chaine de caractère contenant le code OEF.
 * fonction générique.
 * Voir dans l'BlocProgramme "QCM" l'exemple d'une surcharge de cette fonction
 */
{
    
    // Construit le code OEF
    var codePrepBlocProgramme = "\n// Code envoyé par l'BlocProgramme vide "+this.nom+"\n";
    
    return codePrepBlocProgramme;
}

BlocProgramme.prototype.toOEFFromStatement = function(idReponse)
/*
 * Fonction qui permet de générer le code OEF correspondant
 * à l'action de l'BlocProgramme dans le statement.
 * paramètre(s) :    - idReponse = "reponseXXX" où XXX est le numéro (donc l'ordre) de la réponse
 * retourne une chaine de caractère contenant le code OEF.
 * fonction générique.
 * Voir dans l'BlocProgramme "QCM" l'exemple d'une surcharge de cette fonction
 */
{
    
    // Construit le code OEF
    
    var codePrepBlocProgramme = "<div>Sortie de l'BlocProgramme "+this.nom+" dans l'énoncé</div>";
    
    // Construit le numéro de la réponse gérée par l'BlocProgramme dans l'ordre d'apparition (ordre dans l'analyse)
    var numeroReponse = $("#RidAnBlocRep_"+this.nom).index()+1;
    
    codePrepBlocProgramme += "<div>L'BlocProgramme "+this.nom+" gère la réponse "+numeroReponse+"</div>";
    
    return codePrepBlocProgramme;
}

BlocProgramme.prototype.toOEFFromAnswer = function()
/*
 * Fonction qui permet de générer le code OEF correspondant
 * à la réponse gérée par l'BlocProgramme dans l'analyse
 * retourne une chaine de caractères contenant le code OEF.
 * fonction générique.
 * Voir dans l'BlocProgramme "QCM" l'exemple d'une surcharge de cette fonction
 */
{
    
    // Construit le code OEF
    
    var codePrepBlocProgramme = "\n// Code OEF de la réponse gérée par l'BlocProgramme "+this.nom+"\n";
//    codePrepBlocProgramme += "answer{}{}{}{}";
    
    return codePrepBlocProgramme;
}

/*
 * Déclaration du type d'BlocProgramme (enregistre la classe dans l'objet système Ruche)
 * au chargement du code. IMPORTANT : le code des classes dérivées
 * doit être chargé APRES le code de la classe "BlocProgramme" de base.
 */

// ne charge pas cet BlocProgramme, il est virtuel
// rucheSys.initClasseBlocProgramme(BlocProgramme);


BlocProgramme.prototype.trouverSuivant = function(source,cible)
/* 
* Pour le drag and drop 
* Sert à trouver si le bloc pointé suit le bloc source, et renvoi la longueur à laquelle il se trouve si il est bien suivant.
* Paramètres : 
* - source : Le bloc qu'on drag sur un autre bloc
* - cible : le bloc sur lequel on relache le bloc dragué
*/
{        
    var cpt = 0;
    var next = source;
    var trouve = false;

    while(next != null && !trouve)
    {
        next = next.nextElementSibling;//l'élément suivant le bloc droppé
        cpt++;
        if (next==cible)
         {
            trouve = true;
         }

    }

    //cpt++;

    if (!trouve)
    {
        cpt =0;
    }
    console.log("Le bloc visé et de "+cpt+" bloc après.")

    return cpt;
}

BlocProgramme.prototype.trouverPrecedent = function(source,cible)
/* 
* Pour le drag and drop 
* Sert à trouver si le bloc pointé precede le bloc source, et renvoi le nombre de bloc à laquelle il se trouve si il est bien precedent.
* Paramètres : 
* - source : Le bloc qu'on drag sur un autre bloc
* - cible : le bloc sur lequel on relache le bloc dragué
*/
{        
    var cpt = 0;
    var prev = source;
    var trouve = false;

    while(prev != null && !trouve)
    {
        //next = next.nextElementSibling;//l'élément suivant le bloc droppé
        prev = prev.previousElementSibling;
        cpt++;
        if (prev==cible)
         {
            trouve = true;
         }

    }

    if (!trouve)
    {
        cpt =0;
    }
    console.log("Le bloc visé et de "+cpt+" bloc avant.")

    return cpt;
}
