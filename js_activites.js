// Fonction pour filtrer et chercher
function filtrerActivites() {
    var mot = document.getElementById("txtRecherche").value.toLowerCase().trim();
    var cat = document.getElementById("selCategorie").value;
    var cartes = document.getElementsByClassName("carte-item");
    
    var nbVisibles = 0;

    for (var i = 0; i < cartes.length; i++) {
        var itemCat = cartes[i].getAttribute("data-categorie");
        var itemTitre = cartes[i].getAttribute("data-titre").toLowerCase();

        var matchCat = (cat === "Toutes" || cat === itemCat);
        var matchTitre = (itemTitre.indexOf(mot) !== -1);

        if (matchCat && matchTitre) {
            cartes[i].style.display = "block";
            nbVisibles = nbVisibles + 1;
        } else {
            cartes[i].style.display = "none";
        }
    }

}