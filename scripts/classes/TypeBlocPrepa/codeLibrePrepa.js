/*
 * Classe Code Libre (Preparation) :
 * Permet de creer un bloc code libre dans l'onglet prŽparation
 */
function CodeLibrePrepa(numero)
{
	//--------- ATTRIBUTS ---------//


	this.nom = "codeLibre" + numero; // nom de l'ŽlŽment
	//this.txt = ""; //
	this.proto = "CodeLibre"; // nature de l'ŽlŽment


	//--------- METHODES ----------//


	this.creerBloc = function()
	/*
	 * Fonction qui permet de crŽr un bloc dans l'onglet prŽparation
	 * spŽcifique pour un ŽlŽment de type code libre.
	 */
	{
		var bloc_pere = document.getElementById("Rid_Prep_Blocs");
		var liste = document.createElement("LI");
		liste.id = "RidPrBloc_"+this.nom;
		
		/* Modifications pour le drag and drop */
		//On gère l'envoi
		liste.draggable = true;

		liste.addEventListener('dragstart', function(e) {

        		e.dataTransfer.setData('text/plain', liste.id);
        		//e.dataTransfer.setDragImage(dragImg, 40, 40); // Une position de 40x40 pixels centrera l'image (de 80x80 pixels) sous le curseur
        
    		});

		//On gère la réception
    		liste.addEventListener('dragover', function(e) {
        		e.preventDefault(); // Annule l'interdiction de drop
        		console.log('Un élément survole la zone');
    		});

   		liste.addEventListener('drop', function(e) {
        /*Cette fonction sert à décrire ce qui se passera pour le bloc ciblé ce qui se passera lorsqu'on lachera un objet droppable sur lui */
        
        var nomZoneIn=" "; //on va récupérer l'id du bloc reçu. 
        nomZoneIn=e.dataTransfer.getData('text/plain'); // Affiche le contenu du type MIME « text/plain »
        console.log('Données reçu : ' + nomZoneIn);
        //Maintenant nous allons faire en sorte de changer de place le bloc si on passe sur le bloc avant ou après lui

        var id_drop = document.querySelector('#'+nomZoneIn);
        //var li = buttonHaut.parentNode.parentNode;

        // On va gérer le précédent
        var previous = id_drop.previousElementSibling;//l'élément précédent le bloc droppé
        
        var next = id_drop.nextElementSibling;//l'élément suivant le bloc droppé

        var lgNext= Essaim.prototype.trouverSuivant(id_drop,this); //Permet de donner à cb de cases se trouve le bloc ciblé wxc
        var lgPrev=0;
        


        var lgPrev= Essaim.prototype.trouverPrecedent(id_drop,this);
        //var actu= id_drop;
        if(lgNext>0)
        {
            
           
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
            
        });

    /* Fin des modifs */
		
		
		var barre_tache = document.createElement("DIV");
		barre_tache.className = "barre_tache_prepa"; // Pas encore utilisŽ
		var div_fils = document.createElement("DIV");
		var txt = document.createElement('div');
		
		txt.id = "RidPrBloc_Content_"+this.nom;
		txt.className = "Rcl_Droppable Rcl_Editor";
		txt.style.border = "1px grey solid";
		
		
		var button_latex = document.createElement("button");
		button_latex.id = "Rid_Editor_Button_Latex_"+this.nom;
		button_latex.innerHTML = "latex";
		button_latex.className = "Rcl_Editor_Button_Latex";
		button_latex.onclick=function()
		/*
		 * fonction qui permet de dŽfinir du code latex depuis le bloc code libre
		 *
		 */
		{
			var nom = "RidPrBloc_Content_"+this.id.slice("Rid_Editor_Button_Latex_".length,this.id.length);
			rucheSys.etiqueterTexteEnLatex(nom);
		}

		var button = document.createElement('button');
		button.id = "Rid_Button_Delete_" + this.nom;
		button.className = "Rcl_Button_Delete"
		button.onclick = function()
		/*
		 * fonction qui permet de supprimer le bloc code libre
		 *
		 */
		{
			var n = liste.id.slice("RidPrBloc_".length,liste.id.length);
			rucheSys.supprInstruction(n,rucheSys.listeBlocPrepa);
		}

		
		/*Button de deplacement vers le haut*/
		
		var buttonHaut = document.createElement('button');
		buttonHaut.id = "Rid_Button_Up_"+this.nom;
		buttonHaut.className = "Rcl_Move_Up_Arrow";
		buttonHaut.addEventListener('click', function (event)
		{
        	var li = buttonHaut.parentNode.parentNode;
        	var previous = li.previousElementSibling;
        	if (previous)
			{
            	li.parentNode.insertBefore(li, previous);
            	var nom = li.id.slice("RidPrBloc_".length,li.id.length);
            	
            	var ind = rucheSys.rechercheIndice(nom,rucheSys.listeBlocPrepa);
            	
            	var temp = rucheSys.listeBlocPrepa[ind];
            	rucheSys.listeBlocPrepa[ind] = rucheSys.listeBlocPrepa[ind-1];
            	rucheSys.listeBlocPrepa[ind-1] = temp;
    		}
    	},
    	true);

		
		/*button de deplacement vers le bas*/
		
		var buttonBas = document.createElement('button');
		buttonBas.id = "Rid_Button_Down_"+this.nom;
		buttonBas.className = "Rcl_Move_Down_Arrow";
		buttonBas.addEventListener('click', function (event)

		{ 
	        var li = buttonBas.parentNode.parentNode;
	        var next = li.nextElementSibling;
	        if (next)
			{
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

		liste.className = "Rcl_Bloc";
		div_fils.className = "Rcl_Bloc_Interne";

		div_fils.appendChild(button);
		div_fils.appendChild(buttonHaut);
		div_fils.appendChild(buttonBas);
		
		/* Barre Var et Latex */
		barre_tache.appendChild(button_latex);
		div_fils.appendChild(barre_tache);
		
		div_fils.appendChild(txt);
		liste.appendChild(div_fils);
		bloc_pere.appendChild(liste);
		
		var editeurVar = new Editeur(txt.id, rucheSys, true); //true = Pas d'éditeur principal
		rucheSys.listeEditeur.push(editeurVar);	
	}


	//---------------------------------//


	/*this.recupDonnes = function()

	{
		this.valeur = document.getElementById("RidPrBloc_Content_"+this.nom).value;
	}*/
	

	//---------------------------------//


	this.toOEF = function()
	/*
	 * Fonction qui permet de générer le code OEF obtenu grace au bloc " code libre "
	 * retourne une chaine de caractère contenant le code OEF.
	 */
	{	
		indice = rucheSys.rechercheIndice("RidPrBloc_Content_"+this.nom,rucheSys.listeEditeur);
		rucheSys.listeEditeur[indice].recupDonneesVar();		
		return rucheSys.listeEditeur[indice].toOEF()+"\n";
	}	
}
