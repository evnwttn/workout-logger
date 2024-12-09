// ../src/modules/viewModal.mjs

import { formatDate } from "./utils.mjs";

export function renderViewModal(workout) {
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = "";

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");

  const modalTitle = document.createElement("p");
  const modalTitleHeading = document.createElement("span");
  modalTitleHeading.textContent = "Workout Name";
  const modalTitleValue = document.createElement("span");
  modalTitleValue.innerHTML = `${workout.name}`;
  modalTitle.appendChild(modalTitleHeading);
  modalTitle.appendChild(modalTitleValue);

  const modalDate = document.createElement("p");
  const modalDateHeading = document.createElement("span");
  modalDateHeading.textContent = "Date";
  const modalDateValue = document.createElement("span");
  modalDateValue.textContent = `${formatDate(workout.date)}`;

  modalDate.appendChild(modalDateHeading);
  modalDate.appendChild(modalDateValue);

  const separationLine = document.createElement("div");
  separationLine.id = "separation-line";

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(separationLine);
  modalHeader.appendChild(modalDate);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  workout.exercises.forEach((exercise) => {
    const exerciseDiv = document.createElement("div");
    exerciseDiv.classList.add("exercise");

    const exerciseHeader = document.createElement("h4");
    exerciseHeader.textContent = `${exercise.name} - ${exercise.type}`;

    exerciseDiv.appendChild(exerciseHeader);

    // Create table for sets
    const setsTable = createSetsTable(exercise);
    exerciseDiv.appendChild(setsTable);
    modalBody.appendChild(exerciseDiv);
  });

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);

  const modalOverlay = document.getElementById("modal-overlay");
  modalOverlay.style.display = "block";

  const closeModalButton = document.getElementById("close-modal-button");
  closeModalButton.addEventListener("click", closeModal);

  function closeModal() {
    modalContent.innerHTML = "";
    modalOverlay.style.display = "none";
  }
}

function createSetsTable(exercise) {
  const setsTable = document.createElement("table");
  setsTable.classList.add("sets-table");

  // Table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["Set", "Reps"];
  if (exercise.type === "weighted" || exercise.type === "resistance-band") {
    headers.push("Weight (in lbs)");
  }
  if (exercise.type === "resistance-band") {
    headers.push("Resistance (in lbs)");
  }
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  setsTable.appendChild(thead);

  // Table body
  const tbody = document.createElement("tbody");

  exercise.sets.forEach((set, idx) => {
    const row = document.createElement("tr");

    const setNumberCell = document.createElement("td");
    setNumberCell.textContent = idx + 1;

    const repsCell = document.createElement("td");
    repsCell.textContent = set.reps;

    row.appendChild(setNumberCell);
    row.appendChild(repsCell);

    if (exercise.type === "weighted" || exercise.type === "resistance-band") {
      const weightCell = document.createElement("td");
      weightCell.textContent = set.weight;
      row.appendChild(weightCell);
    }

    tbody.appendChild(row);
  });

  setsTable.appendChild(tbody);
  return setsTable;
}
