let participants = JSON.parse(localStorage.getItem("participants")) || [];

const btn_nouveau_participant = document.getElementById(
  "btn_nouveau_participant",
);
const anuller_create_participant = document.getElementById(
  "anuller_create_participant",
);

const btn_add_participant = document.getElementById("btn_add_participant");
const popup_modifier_participant = document.getElementById(
  "popup_modifier_participant",
);

btn_nouveau_participant.addEventListener("click", () => {
  document
    .getElementById("popup_ajoute_participant")
    .classList.remove("hidden");
});

anuller_create_participant.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("popup_ajoute_participant").classList.add("hidden");
});

//  FUNCTION => POUR AJOUTER UN PARTICIPANT :
const AjouterParticipant = (e) => {
  e.preventDefault();

  const formAddParticipant = document.forms.add_participant;
  const fullName = formAddParticipant.fullname;
  const pseudo = formAddParticipant.pseudo;

  if (fullName.value.trim() === "") {
    fullName.nextElementSibling.textContent = "Invalid FullName";
    return;
  }
  if (fullName.value.trim().length < 5) {
    fullName.nextElementSibling.textContent = "FullName at least 5 caractere";
    return;
  }

  if (pseudo.value.trim() === "") {
    pseudo.nextElementSibling.textContent = "Invalid Pseudo";
    return;
  }
  if (pseudo.value.trim().length < 5) {
    pseudo.nextElementSibling.textContent = "FullName at least 5 caractere";
    return;
  }

  const nouveauParticipant = {
    id: Date.now(),
    fullName: fullName.value,
    pseudo: pseudo.value,
  };
  participants.push(nouveauParticipant);
  fullName.value = "";
  pseudo.value = "";
  fullName.nextElementSibling.textContent = "";
  pseudo.nextElementSibling.textContent = "";
  document.getElementById("popup_ajoute_participant").classList.add("hidden");
  localStorage.setItem("participants", JSON.stringify(participants));
  AffichageParticipants();
};

// BUTTON => AJOUTER PARTICIPANTS :
btn_add_participant.addEventListener("click", AjouterParticipant);

// FUNCTION => POUR AFFICHAGE DE LES PARTICIPANTS :
function AffichageParticipants(filterInput = "") {
  if (
    JSON.parse(localStorage.getItem("participants"))?.length === 0 ||
    participants.length === 0
  ) {
    document.getElementById("container_participant").innerHTML = ``;
    document.querySelector(".info-about-participants").innerHTML =
      `<h3 class="text-[40px] font-semibold text-center max-w-[60%] mx-auto mt-20">ne trouve pas des participants ici 😢😢</h3>`;
    return;
  }

  document.querySelector(".info-about-participants").innerHTML = ``;
  document.getElementById("container_participant").innerHTML = ``;

  const ps =
    filterInput === ""
      ? participants
      : participants.filter((ele) =>
          ele.fullName.toLowerCase().includes(filterInput.toLowerCase()),
        );

  ps.forEach((p) => {
    document.getElementById("container_participant").innerHTML += `
    <article class="cart shadow-md hover:shadow-2xl py-3 px-4 rounded-lg">
        ${topCart(p)}
        ${contenu()}
        ${footerCart(p)}
    </article>
    `;
  });
}

const topCart = (p) => {
  return `
    <div class="top-cart flex items-center mb-4">
      <h3 class="bg-red-300 min-h-fit max-w-fit rounded-full p-2 font-bold">${p.fullName[0].toUpperCase()}${p.fullName[1].toUpperCase()}</h3>
        <div class="flex flex-col mx-3">
          <b>${p.fullName}</b>
          <span>${p.pseudo}</span>
        </div>
    </div>
  `;
};

const contenu = () => {
  return `
    <div class="content">
      <h4>Defis en Cours :</h4>
      <div>
        <span>Lorem, ipsum.</span>
        <span>Lorem,</span>
        <span>Lorem, ipsum.</span>
      </div>
    </div>
  `;
};

const footerCart = (p) => {
  return `
    <div class="footer-cart mt-4 flex space-x-5">
      <button data-id="${p.id}" id="modifier_participant" class="hover:text-green-500 transition-all duration-400"><i class="fa-solid fa-pencil"></i>Modifier</button>
      <button data-id="${p.id}" id="Supprimer_participant" class="Supprimer_participant hover:text-red-500 transition-all duration-400"><i class="fa-solid fa-trash"></i>Supprimer</button>
    </div>
  `;
};

// FUNCTION => POUR SUPPRIMER UN PARTICIPANT
function SuppressionParticipant(idParticipant) {
  if (!confirm("tes-vous sûr de vouloir supprimer ce participant ?")) {
    return;
  }
  const findParticipant = participants.find(
    (p) => p.id === Number(idParticipant),
  );
  if (!findParticipant) return;
  const IndexParticipant = findIndexParticipant(findParticipant);
  participants.splice(IndexParticipant, 1);
  localStorage.setItem("participants", JSON.stringify(participants));
  AffichageParticipants();
}

// FONCTION => POUR MODIFIER UN PARTICIPANT
function ModifierParticipant(idParticipant) {
  const findParticipant = participants.find(
    (p) => p.id === Number(idParticipant),
  );
  if (!findParticipant) return;
  const FormModifierParticipant = document.forms.modifier_participant;
  FormModifierParticipant.fullname.value = findParticipant.fullName;
  FormModifierParticipant.pseudo.value = findParticipant.pseudo;

  // MODIFICATION DE OBJECT DE PARTICIPANT =>
  document
    .getElementById("btn_modifier_participant")
    .addEventListener("click", (e) => {
      let fullName = FormModifierParticipant.fullname.value;
      let pseudo = FormModifierParticipant.pseudo.value;
      console.log(fullName);
      console.log(pseudo);

      e.preventDefault();
      participants = participants.map((p) => {
        return p.id == idParticipant
          ? {
              id: p.id,
              fullName: fullName,
              pseudo: pseudo,
            }
          : p;
      });

      localStorage.setItem("participants", JSON.stringify(participants));
      popup_modifier_participant.classList.add("hidden");
      AffichageParticipants();
    });

  AffichagePopupModifier();
}

// FONCTION => AFFICHAGE POPUP DE MODIFIER :
function AffichagePopupModifier() {
  popup_modifier_participant.classList.remove("hidden");
}

// FUNCTION => TROUVER LE INDEX DE PARTICIPANT (aide dans la fonction de supression)
function findIndexParticipant(p) {
  let indexP = null;
  for (let i = 0; i < participants.length; i++) {
    if (participants[i].id === p.id) {
      return (indexP = i);
    }
  }
}

document
  .getElementById("container_participant")
  .addEventListener("click", (e) => {
    if (e.target.id === "Supprimer_participant") {
      SuppressionParticipant(e.target.dataset.id);
    }
    if (e.target.id === "modifier_participant") {
      ModifierParticipant(e.target.dataset.id);
    }
  });

// FILTRAGE DE PARTICIPANTS AVEC SON NOM :
document.getElementById("input_recherech").addEventListener("input", (e) => {
  AffichageParticipants(e.target.value);
});

AffichageParticipants();
