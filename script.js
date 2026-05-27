const DATA_API =
  "https://script.google.com/macros/s/AKfycbwkm0i_V4s8gykenzlUy8RS89uJnKI7Th1YdwKhVnRMVARD3bGVOyvMlUEMdA4tVTrH/exec";

const REVIVE_API = DATA_API;

let REVIVE_DATA = {};

async function init() {

  // ------------------------------
  // LOAD REVIVE DATA
  // ------------------------------
  try {

    const response =
      await fetch(DATA_API);

    REVIVE_DATA =
      await response.json();

    console.log(
      "✅ REVIVE_DATA loaded:",
      REVIVE_DATA
    );

  } catch (err) {

    console.error(
      "❌ Failed to load revive data:",
      err
    );

    return;
  }

  // ------------------------------
  // ELEMENTS
  // ------------------------------
  const sectorEl =
    document.getElementById("sector");

  const suburbEl =
    document.getElementById("suburb");

  const reviveEl =
    document.getElementById("revivePoint");

  const maintainerEl =
    document.getElementById("maintainer");

  const formEl =
    document.getElementById("reviveForm");

  const statusEl =
    document.getElementById("status");

  // ------------------------------
  // SECTOR → SUBURB MAP
  // ------------------------------
  const sectorSuburbs = {

    NW: [
      "Dakerstown","Jensentown","Quarlesbank","West Boundwood",
      "East Boundwood","Roywood","Judgewood","Gatcombeton",
      "Shuttlebank","Yagoton","Peddlesden Village","Chudleyton",
      "Darvall Heights","Eastonwood","Brooke Hills","Dunell Hills",
      "West Becktown","East Becktown","Owsleybank","Molebank",
      "Lukinswood"
    ],

    NE: [
      "Lamport Hills","Chancelwood","Earletown","Rhodenbank",
      "Dulston","Millen Hills","Raines Hills","Pashenton",
      "Rolt Heights","Pescodside","Shearbank","Huntley Heights",
      "Santlerville","Gibsonton","Dunningwood","Heytown",
      "Spracklingbank","Paynterton","Peppardville","Pitneybank",
      "Starlingtown"
    ],

    SW: [
      "Grigg Heights","Reganbank","Lerwill Heights","Crooketon",
      "Mornington","North Blythville","Nixbank","Wykewood",
      "South Blythville","Greentown","Tapton","Foulkes Village",
      "Ruddlebank","Lockettside","Dartside","Kinch Heights",
      "New Arkham","Old Arkham","Spicer Hills","Williamsville",
      "Buttonville"
    ],

    SE: [
      "Edgecombe","Pegton","Dentonside","Crowbank",
      "Vinetown","Houldenbank","Kempsterbank","Wray Heights",
      "Gulsonside","Osmondville","Penny Heights","West Grayside",
      "East Grayside","Scarletwood","Pennville","Fryerbank",
      "Wyke Hills","Hollomstown","Danversbank","Whittenside",
      "Miltown"
    ],

    Central: [
      "Richmond Hills","Ketchelbank","Roachtown","Randallbank",
      "Havercroft","Barrville","Ridleybank","Pimbank",
      "Shore Hills","Galbraith Hills","Stanbury Village",
      "Roftwood","Brooksville","Mockridge Heights",
      "Shackleville","Tollyton"
    ]
  };

  // ------------------------------
  // SECTOR → SUBURBS
  // ------------------------------
  sectorEl.addEventListener(
    "change",
    function () {

      const sector =
        this.value;

      suburbEl.innerHTML =
        '<option value="">--</option>';

      reviveEl.innerHTML =
        '<option value="">--</option>';

      maintainerEl.value = "";

      if (!sectorSuburbs[sector]) return;

      sectorSuburbs[sector]
        .forEach(sub => {

          const opt =
            document.createElement("option");

          opt.value = sub;
          opt.textContent = sub;

          suburbEl.appendChild(opt);
        });
    }
  );

  // ------------------------------
  // SUBURB → REVIVE POINTS
  // ------------------------------
  suburbEl.addEventListener(
    "change",
    function () {

      const suburb =
        this.value.trim();

      reviveEl.innerHTML =
        '<option value="">--</option>';

      maintainerEl.value = "";

      console.log(
        "➡ Suburb selected:",
        suburb
      );

    const points =
  REVIVE_DATA[suburb];

      console.log(
        "POINTS:",
        points
      );

      if (
        !points ||
        !Array.isArray(points)
      ) {

        console.warn(
          "❌ No revive data found:",
          suburb
        );

        return;
      }

      points.forEach(point => {

        const opt =
          document.createElement("option");

        opt.value =
          point.name;

        opt.textContent =
          point.name;

        reviveEl.appendChild(opt);
      });

      console.log(
        "✅ Loaded revive points:",
        points.length
      );
    }
  );

  // ------------------------------
  // REVIVE POINT → MAINTAINER
  // ------------------------------
  reviveEl.addEventListener(
    "change",
    function () {

      const suburb =
        suburbEl.value.trim();

      const point =
        this.value;

      const match =
        (REVIVE_DATA[suburb] || [])
          .find(
            p => p.name === point
          );

      maintainerEl.value =
        match?.maintainer ||
        "Not maintained";
    }
  );

  // ------------------------------
  // FORM SUBMIT
  // ------------------------------
  formEl.addEventListener(
    "submit",
    async function (e) {

      e.preventDefault();

      statusEl.textContent =
        "Sending revive request...";

      try {

        const formData =
          new URLSearchParams();

        formData.append(
          "playerName",
          formEl.playerName.value
        );

        formData.append(
          "profileLink",
          formEl.profileLink.value
        );

        formData.append(
          "sector",
          sectorEl.value
        );

        formData.append(
          "suburb",
          suburbEl.value
        );

        formData.append(
          "location",
          reviveEl.value
        );

        formData.append(
          "notes",
          formEl.notes.value
        );

        const response =
          await fetch(
            REVIVE_API,
            {
              method: "POST",
              body: formData
            }
          );

        const result =
          await response.json();

        console.log(
          "✅ Server response:",
          result
        );

        if (result.status === "OK") {

          statusEl.textContent =
            "✅ Revive request transmitted.";

          formEl.reset();

          suburbEl.innerHTML =
            '<option value="">--</option>';

          reviveEl.innerHTML =
            '<option value="">--</option>';

          maintainerEl.value = "";

        } else {

          statusEl.textContent =
            "❌ Submission failed.";
        }

      } catch (err) {

        console.error(err);

        statusEl.textContent =
          "❌ Connection error.";
      }
    }
  );
}

init();
