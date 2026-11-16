// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', function () 
{

    // Récupération des éléments du formulaire
    var form = document.getElementById('reservationForm');
    var activiteSelect = document.getElementById('activite');
    var participantsInput = document.getElementById('participants');
    var dateInput = document.getElementById('date');
    var emailInput = document.getElementById('email');
    var telInput = document.getElementById('telephone');
    var conditionsCheckbox = document.getElementById('conditions');

    // Récupération des boutons
    var btnCalculer = document.getElementById('btnCalculer');

    // Récupération des zones d'affichage
    var recapContainer = document.getElementById('recapContainer');
    var valSousTotal = document.getElementById('valSousTotal');
    var valRemise = document.getElementById('valRemise');
    var valTotal = document.getElementById('valTotal');
    var confirmationMessage = document.getElementById('confirmationMessage');
    var errorContainer = document.getElementById('errorContainer');

    // --- 1. Fonction de calcul du prix ---
    function calculerPrix() {
        var selectedOption = activiteSelect.options[activiteSelect.selectedIndex];
        
        // Vérifier si une activité est sélectionnée
        if (!selectedOption || !selectedOption.dataset.prix) {
            valSousTotal.textContent = '0';
            valRemise.textContent = '0';
            valTotal.textContent = '0';
            return { sousTotal: 0, remise: 0, total: 0 };
        }

        var prixUnitaire = parseFloat(selectedOption.dataset.prix);
        var nbParticipants = parseInt(participantsInput.value) || 0;

        // Calcul du sous-total
        var sousTotal = prixUnitaire * nbParticipants;

        // Calcul de la remise (10% si >= 4 participants)
        var remise = 0;
        if (nbParticipants >= 4) {
            remise = sousTotal * 0.10;
        }

        // Calcul du total final
        var total = sousTotal - remise;

        // Mise à jour de l'affichage dans la page
        valSousTotal.textContent = sousTotal.toFixed(2);
        valRemise.textContent = remise.toFixed(2);
        valTotal.textContent = total.toFixed(2);

        // Afficher la zone de récapitulatif
        recapContainer.classList.remove('d-none');

        return { sousTotal: sousTotal, remise: remise, total: total };
    }

    // --- Événements pour mise à jour automatique des prix ---
    activiteSelect.addEventListener('change', calculerPrix);
    participantsInput.addEventListener('input', calculerPrix);
    btnCalculer.addEventListener('click', calculerPrix);

    // --- 2. Validation et Soumission du formulaire ---
    form.addEventListener('submit', function (e) {
        // Empêcher l'envoi / rechargement de la page
        e.preventDefault();

        // Cacher les messages d'erreur et de confirmation au départ
        errorContainer.classList.add('d-none');
        confirmationMessage.classList.add('d-none');
        errorContainer.innerHTML = '';

        var meffageErreurs = [];

        // Validation des champs textuels simples
        var nom = document.getElementById('nom').value.trim();
        var prenom = document.getElementById('prenom').value.trim();
        if (nom === '' || prenom === '') {
            meffageErreurs.push('Veuillez remplir le nom et le prénom.');
        }

        // Validation e-mail (doit contenir '@' et '.')
        var email = emailInput.value.trim();
        if (email === '' || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            meffageErreurs.push('Veuillez saisir une adresse e-mail valide.');
        }

        // Validation téléphone non vide
        if (telInput.value.trim() === '') {
            meffageErreurs.push('Le numéro de téléphone est obligatoire.');
        }

        // Validation de l'activité choisie
        if (activiteSelect.value === '') {
            meffageErreurs.push('Veuillez choisir une activité.');
        }

        // Validation de la date (non passée)
        var dateChoisie = dateInput.value;
        if (dateChoisie === '') {
            meffageErreurs.push('Veuillez sélectionner une date.');
        } else {
            var dateAujourdhui = new Date();
            dateAujourdhui.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer uniquement les dates
            var dateSelectionnee = new Date(dateChoisie);

            if (dateSelectionnee < dateAujourdhui) {
                meffageErreurs.push('La date souhaitée ne peut pas être dans le passé.');
            }
        }

        // Validation nombre de participants (entre 1 et 6)
        var nbPart = parseInt(participantsInput.value);
        if (isNaN(nbPart) || nbPart < 1 || nbPart > 6) {
            meffageErreurs.push('Le nombre de participants doit être compris entre 1 et 6.');
        }

        // Validation case à cocher des conditions
        if (!conditionsCheckbox.checked) {
            meffageErreurs.push('Vous devez accepter les conditions de simulation.');
        }

        // --- Vérification du résultat des contrôles ---
        if (meffageErreurs.length > 0) {
            // Affichage des erreurs si le formulaire est invalide
            errorContainer.innerHTML = '<strong>Erreur :</strong><br>' + meffageErreurs.join('<br>');
            errorContainer.classList.remove('d-none');
        } else {
            // Formulaire valide : calculer et afficher le récapitulatif
            calculerPrix();
            confirmationMessage.classList.remove('d-none');
        }
    });


});