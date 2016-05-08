/**
 * BlocFocus est un bloc qui apparait en "surpage" dans le but de crée une fenetre de travail sur
 * toute la page.
 * 
 * @param content - contenu initial du bloc, peut changer au cours du temps.
 * @param affichage - element qui contiendra le bouton qui permet le réaffichage du bloc
 */
BlocFocus = function(content, affichage){
    this.proto = "BlocFocus"
    this.container;
    this.content;
    this.background;
    this.width;
    this.height;
    this.headerHeight = 20;
    
    /*Contient un ensemble de fonction à effectuer lors du resize du bloc*/
    this.resizeListener = [];
    
    /*Initialisation du bloc*/
    var self = this;
    this.initBloc();
    if (content !== undefined){
	content.appendTo(this.content);
    }
    var $button = $("<input type='button' value='afficher'/>")
	.click(function(){
	    self.show();
	})
	.appendTo($(affichage));
}

BlocFocus.prototype.proto = "BlocFocus";

/**
 * initBloc
 * fonction qui initialise le bloc avec le container, et le bouton qui permet de réduire la fenetre
 * et qui prépare le bloc contenant les élément à venir.
 */
BlocFocus.prototype.initBloc = function(){
    var self = this;
    this.container = $("<div></div>")
	.css({"width":$(document).width() - 20, 
	      "height":$(document).height() - 20, 
	      "background-color":"#ffffff", 
	      "position":"absolute", 
	      "top":"10px", 
	      "left":"10px"/*, 
	      "border-radius":"20px"*/})
	.appendTo($(document.body));
    
    var $quit = $("<div></div>")
	.css({
	    "background-image":"url(images/cross.png)",
	    "background-size":this.headerHeight + "px " + this.headerHeight + "px",
	    "width": this.headerHeight + "px",
	    "height": this.headerHeight + "px",
	    "position":"absolute",
	    "top": "5px",
	    "right":"5px",
	    "z-index":"1000"}) /*On se garantie que le quit soit toujours au sommet*/
	.appendTo(this.container);
    
    $($quit).hover(
	function(){
	    $quit.css({"background-image":"url(images/cross_active.png)"})
	},
	function(){
	    $($quit).css({"background-image":"url(images/cross.png"});
	});
    
    $($quit).click(
	function(){
	    self.hide();
	});
    
    this.content = $("<div></div>")
	.css({
	    "width":"100%", 
	    "height":"100%"/*this.container.height()/* - this.headerHeight*/,
	    "position":"absolute",
	    "top":/*this.headerHeight+"px"*/0,
	    "border-radius":"20px"})
	.appendTo(this.container);

    /*On ajoute un petit temps d'attente pour s'assurer que la fenetre à fini de se redimensionner
     avant de redimensionner ce cadre*/
    var timer;
    $(window).resize(function(){
	clearTimeout(timer);
	timer = setTimeout(function(){
	    self.container.css("width", $(document.body).width() - 20);
	    self.container.css("height", $(document.body).height() - 20);
	    
	    /*Ici, on fait appelle à toute les fonctions contenu dans le tableau pour effectuer
	     * le comportement attendu lors du redimensionnement de cet element.*/
	    for (var i = 0; i < self.resizeListener.length; i++){
		self.resizeListener[i]();
	    }
	}, 5);
    });
}


/**
 * setContent
 * Fonction qui permet de changer le contenu de la surpage, si cela est nécéssaire
 * @param newContent - nouveau contenu du bloc de surpage.
 */
BlocFocus.prototype.setContent = function(newContent){
    if (newContent !== undefined){
	this.content.empty();
	newContent.appendTo(this.content);
    }else{
	console.error("Le bloc fournie n'est pas définie");
    }
}

/**
 * show
 * Fonction qui permet de faire apparaitre le bloc sur la page
 * @param time - Temps de l'animation complete en milliseconde.
 */
BlocFocus.prototype.show = function(time = 150){
    this.container.fadeIn(time);
}

/**
 * hide
 * Fonction qui permet de masquer le bloc de la page
 * @param time - Temps de l'animation complete en milliseconde.
 */
BlocFocus.prototype.hide = function(time = 150){
    this.container.fadeOut(time);
}

/**
 * resize
 * Fonction qui ajoute un ecouteurs de resize
 * @param fun - fonction à executer lors d'un redimensionnement
 */
BlocFocus.prototype.resize = function(fun){
    this.resizeListener.push(fun);
}

/**
 * width
 * Fonction qui retourne la largeur du bloc qui contient les elements de l'utilisateur et donc pas
 * necessairement la largeur de la surpage en elle meme
 */
BlocFocus.prototype.width = function(){
    if (this.content === undefined){
	console.error("Un comportement anormal à eu lieu, le bloc de contenu est vide.");
    }else{
	return this.content.width();
    }
}

/**
 * height
 * Fonction qui retourne la hauteur du bloc qui contient les elements de l'utilisateur et donc pas
 * necessairements la hauteur de la surpage en elle meme
 */
BlocFocus.prototype.height = function(){
    if (this.content === undefined){
	console.error("Un comportement anormal à eu lieu, le bloc de contenu est vide.");
    }else{
	return this.content.height();
    }
}

$(document).ready(function(){
});