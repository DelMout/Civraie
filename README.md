# Civraie

Magasin de la ferme de la Civraie
Site destiné aux clients du magasin de la ferme de la Civraie pour commander légumes, fromages, viandes, ...

-   Table "Date"
    Les dates sont renseignées initialement par l'administrateur (vendredi pour date au plus tard et vendredi suivant pour livraison). Ces dates peuvent être modifiées par le propriétaire seulement pour le lancement de la prochaine commande. Si toutes les dates devaient modifiées, seulement l'administrateur le peut.

*   Construction du panier
    On prend de la databse tous les products actived et les quantités commandées dans le localStorage et on affiche et enregistre dans la database quand quantity > 0.
