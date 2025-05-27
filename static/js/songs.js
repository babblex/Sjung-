// static/js/songs.js
export const songs = [
  {
    id:          "det_var_sa_roligt",
    title:       "Det var så roligt jag måste skratta",
    defaultBpm: 136,
    cues: [
      { t: 11.00, line: "Det var så roligt jag måste skratta" },
      { t: 13.15, line: "Det kom en trekantig gubbe in" },
      { t: 16.00, line: "Han hade träskor och näver-jacka" },
      { t: 19.00, line: "Och hatten kantad med korva-skinn." },
      { t: 21.00, line: "Han satte sig på en pall i köket" },
      { t: 26.23, line: "Och drog ur fickan sitt munspel opp" },
      { t: 32.00, line: "Och börja spela så allting dansa" },
      { t: 37.00, line: "Med skrim och skrammel och tjo och hopp" },
      { t: 64.00, line: "Det var så roligt jag måste skratta" },
      { t: 66.00, line: "Det gick en spelande gubbe ut" },
      { t: 69.00, line: "Och allting dansade bort med honom" },
      { t: 71.00, line: "Så hela köket blev tomt till slut." },
      { t: 74.00, line: "Det var så länge sen som det hände" },
      { t: 79.00, line: "Men jag blev sittande där jag var." },
      { t: 85.00, line: "Först blev jag morfar, så blev jag farfar" },
      { t: 90.00, line: "Så blev jag farfarsfar farfars far" }
    ],
    writers:     ["L. Hellsing", "K. Brodin"],
    
    
    audioVocals: "/static/audio/Det var så roligt Ljudfiler/Det var så roligt Sopran.mp3",
    audioInstr : "/static/audio/Det var så roligt Ljudfiler/Det var så roligt No vocals.mp3",

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
