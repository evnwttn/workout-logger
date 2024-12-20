import { renderWorkoutHistory } from "../modules/renderWorkouts.mjs";
import { renderEditModal } from "../modules/editModal.mjs";

document.addEventListener("DOMContentLoaded", () => {
  let filterOptionVisible = false;
  let filterOptionContainer = null;

  // Get user data
  const currentUser = sessionStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const workouts = users[currentUser].workouts || [];

  const mainContainer = document.getElementById("main-container");
  const logWorkoutButton = document.createElement("button");
  logWorkoutButton.id = "log-workout-button";
  logWorkoutButton.classList.add("log-workout-button");
  logWorkoutButton.innerHTML = `<span class="plus-icon">+</span>Log Workout`;

  logWorkoutButton.addEventListener("click", () => {
    renderEditModal();
  });

  if (workouts.length === 0) {
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `
      <div style="margin: auto">
      <h1 style="max-width: 600px; height: auto; text-align: center">
        Your fitness journey starts with one workout - log it now!
      </h1>
      </div>
    `;

    const h1Element = mainContainer.querySelector("h1");
    h1Element.insertAdjacentElement("afterend", logWorkoutButton);

    logWorkoutButton.classList.add("center");
  } else {
    mainContainer.innerHTML = "";
    mainContainer.innerHTML = `<header>
          <h1>Workout History</h1>
          <div class="filter-container btn-secondary" id="filter-container">
            <span class="material-symbols-outlined"> tune </span>
            Filter
          </div>
        </header>

        <div id="history-container" class="sub-container">
          <!-- Previous workouts will be added here dynamically -->
        </div>`;

    mainContainer.appendChild(logWorkoutButton);
    // Initially render all workouts
    renderWorkoutHistory();

    // Filter functionality
    const filterButton = document.getElementById("filter-container");
    filterButton.addEventListener("click", () => {
      if (filterOptionVisible) {
        hideFilterOptions();
      } else {
        showFilterOptions();
      }
    });

    function showFilterOptions() {
      filterOptionVisible = true;

      // Create filterOptionContainer if it doesn't exist
      if (!filterOptionContainer) {
        // Create filterOptionContainer
        filterOptionContainer = document.createElement("div");
        filterOptionContainer.classList.add("filter-options-container");
        filterOptionContainer.classList.add("sub-container");
        // Create filter form
        const filterForm = document.createElement("form");
        filterForm.id = "filter-form";

        // Name filter group
        const nameFilterGroup = document.createElement("div");
        nameFilterGroup.classList.add("filter-group");

        const nameFilterLabel = document.createElement("label");
        nameFilterLabel.textContent = "Name: ";
        nameFilterLabel.setAttribute("for", "name-filter");

        const nameFilterInput = document.createElement("input");
        nameFilterInput.type = "text";
        nameFilterInput.name = "name-filter";
        nameFilterInput.id = "name-filter";
        nameFilterInput.placeholder = "Name of workout";
        nameFilterInput.autocomplete = "off";

        nameFilterGroup.appendChild(nameFilterLabel);
        nameFilterGroup.appendChild(nameFilterInput);

        // Date filter group
        const dateFilterGroup = document.createElement("div");
        dateFilterGroup.classList.add("filter-group");

        const fromDateLabel = document.createElement("label");
        fromDateLabel.textContent = "From: ";
        fromDateLabel.setAttribute("for", "from-date");

        const fromDateInput = document.createElement("input");
        fromDateInput.type = "date";
        fromDateInput.name = "from-date";
        fromDateInput.id = "from-date";

        const toDateLabel = document.createElement("label");
        toDateLabel.textContent = "To: ";
        toDateLabel.setAttribute("for", "to-date");

        const toDateInput = document.createElement("input");
        toDateInput.type = "date";
        toDateInput.name = "to-date";
        toDateInput.id = "to-date";

        dateFilterGroup.appendChild(fromDateLabel);
        dateFilterGroup.appendChild(fromDateInput);
        dateFilterGroup.appendChild(toDateLabel);
        dateFilterGroup.appendChild(toDateInput);

        // Apply Filter button
        const applyFilterButton = document.createElement("button");
        applyFilterButton.type = "button";
        applyFilterButton.textContent = "Apply Filters";
        applyFilterButton.classList.add("btn-primary");
        applyFilterButton.addEventListener("click", applyFilters);

        // Append groups to form
        filterForm.appendChild(nameFilterGroup);
        filterForm.appendChild(dateFilterGroup);
        filterForm.appendChild(applyFilterButton);

        // Append form to filterOptionContainer
        filterOptionContainer.appendChild(filterForm);
      }

      // Append filterOptionContainer to desired location (e.g., below header)
      const header = document.querySelector("header");
      header.insertAdjacentElement("afterend", filterOptionContainer);
    }

    function hideFilterOptions() {
      filterOptionVisible = false;
      if (filterOptionContainer && filterOptionContainer.parentNode) {
        filterOptionContainer.parentNode.removeChild(filterOptionContainer);
      }
      // Reset filters and re-render all workouts
      renderWorkoutHistory(workouts);
    }

    function applyFilters() {
      const nameFilterInput = document
        .getElementById("name-filter")
        .value.trim()
        .toLowerCase();
      const fromDateInput = document.getElementById("from-date").value;
      const toDateInput = document.getElementById("to-date").value;

      // Validate date inputs before filtering
      if (fromDateInput && toDateInput) {
        if (
          new Date(fromDateInput + "T00:00:00") >
          new Date(toDateInput + "T00:00:00")
        ) {
          return;
        }
      }

      // Proceed with filtering
      const filteredWorkouts = workouts.filter((workout) => {
        let match = true;

        // Filter by name
        if (nameFilterInput) {
          match = match && workout.name.toLowerCase().includes(nameFilterInput);
        }

        const workoutDate = workout.date; // 'YYYY-MM-DD' format
        if (fromDateInput) {
          match = match && workoutDate >= fromDateInput;
        }

        // Filter by to date
        if (toDateInput) {
          match = match && workoutDate <= toDateInput;
        }

        return match;
      });

      // Re-render the workout history with filtered workouts
      renderWorkoutHistory(filteredWorkouts);
    }
  }
});
