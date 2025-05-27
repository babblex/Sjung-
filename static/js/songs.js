// static/js/songs.js
export const songs = [
  {
    id:          "det_var_sa_roligt",
    title:       "Det var så roligt jag måste skratta",
    writers:     ["L. Hellsing", "K. Brodin"],

    lyrics: `
Det var så roligt, jag måste skratta
det kom en trekantig gubbe i …
… så blev jag farfarsfar farfarsfar
`,

    
    audioVocals: "/static/audio/Det_var_sa_roligt_Ljudfiler/Det_var_sa_roligt_Sopran.mp3",
    audioInstr : "/static/audio/Det_var_sa_roligt_Ljudfiler/Det_var_sa_roligt_No_vocals.mp3",

    tips: {
      focusText: [
        "Berätta den fritt som en saga. Man kan ha bilder till som stöd, eller låta barnen rita egna bilder.",
        "Call-and-response: Prata texten i korta delar, exempelvis: ”Det var så roligt jag måste skratta”, låt barnen härma …",
        "Call-and-response."
      ],
      musikForm: [
        "<strong>Intro:</strong> Hälsa på den som står bredvid",
        "<strong>Vers:</strong> Stå på din plats i ringen, sjung och gör TAKK."
      ]
    },

    infoHtml: /* html */ `
      <h6>Det var så roligt jag måste skratta</h6>
      <p><strong>Text:</strong> L. Hellsing &nbsp; <strong>Musik:</strong> K. Brodin</p>

      <p>”Det var så roligt …” är vald utifrån att det är en sång med relativt mycket
         text som lockar de lite äldre barnen …</p>

      <div class="row g-4">
        <div class="col-md-6 text-center">
          <img src="/static/images/band.png" class="img-fluid rounded-3" alt="Bandet">
          <p class="mt-2"><strong>Arrangör och pianist:</strong><br>Erland Sjunnesson<br>
             <strong>Kontrabas:</strong> Jan Karlsson<br>
             <strong>Trummor:</strong> Bo Håkansson</p>
        </div>
        <div class="col-md-6 text-center">
          <img src="/static/images/sangare.png" class="img-fluid rounded-3" alt="Sångare">
          <p class="mt-2"><strong>Sångare:</strong><br>Malin L. Dovstedt<br>
             Isabelle Koenen<br>Carl-Johan Hedbrand</p>
        </div>
      </div>`
  }

  /* ---- lägg en komma + nytt objekt när du lägger till nästa låt:
  ,{
    id: "nästa_låt",
    ...
  }
  */
];
