const todo = localStorage.getItem("items")
          ? JSON.parse(localStorage.getItem("items"))
          : [];

// Event listener for "Enter" button
document.querySelector("#enter").addEventListener("click", () => {
  const item = document.querySelector("#item");
  const deadline = document.querySelector("#deadline");
  const category = document.querySelector(".select-category");
  const description = document.querySelector(".description-input");
  createItem(item, deadline, category, description);
});

// Event listener for Enter keyboard press
document.querySelector("#item").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const item = document.querySelector("#item");
    const deadline = document.querySelector("#deadline");
    const category = document.querySelector(".select-category");
    const description = document.querySelector(".description-input");
    createItem(item, deadline, category, description);
  }
});

//Open task for add task button
function openAddTask() {
  const rightColumn = document.querySelector('.right-column');
  rightColumn.style.display = "flex";
}

//To do list display after input and save
function displayItems() {
  const todoList = document.querySelector("#to-do-list");
  const todoCount = document.querySelector("#todoCount");

  todoList.innerHTML = "";

  // Sort items by deadline (earliest to latest)
  todo.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  // Group tasks by date
  const groupedTasks = todo.reduce((groups, item) => {
    const date = new Date(item.deadline).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Render grouped tasks
  for (const [date, tasks] of Object.entries(groupedTasks)) {
    // Add date heading
    const dateHeading = document.createElement("h3");
    dateHeading.style.margin = "20px 0 0 0";
    dateHeading.textContent = date;
    todoList.appendChild(dateHeading);

    // Add tasks for this date
    tasks.forEach((item) => {
      const p = document.createElement("div");
      p.className = `${item.disabled ? "checkbox-disabled" : ""} checkbox-list`;
      p.id = `${todo.indexOf(item)}`
      p.style.margin = "-3px 0 -3px 0";
      p.innerHTML = `
      <span class="custom-checkbox"></span>
      <input class="to-do-checkbox" type="checkbox" id="input-${todo.indexOf(item)}" ${item.disabled ? "checked" : ""}>
      <p style="margin-left: 70px" id="todo-${todo.indexOf(item)}" class="${item.disabled ? "disabled" : ""}">
      ${item.text}</p>
      <p class="sub-box">${item.category}</p>
      `;
      p.querySelector(".to-do-checkbox").addEventListener("change", () => {
        toggleTask(todo.indexOf(item));
      });
      todoList.appendChild(p);
    });
  }
  const disabledCount = todo.filter(item => !item.disabled).length;
  todoCount.textContent = disabledCount;
}

// To do list structure
function createItem(item, deadline, category, description) {
  if (
    item.value.trim() === "" ||
    deadline.value === "" ||
    category.value === "Category" ||
    description.value.trim() === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }
  
  todo.push({
    text: item.value,
    disabled: false,
    deadline: deadline.value,
    category: category.value,
    description: description.value,
  });
  saveToLocalStorage();
  clearInput();
  displayItems();
}

function updateItem(text, deadline, i) {
  todo[i] = { text, deadline, description };
  localStorage.setItem("items", JSON.stringify(todo));
  displayItems();
}

function toggleAddTask() {
  const rightColumn = document.querySelector('.right-column');
  
  if (rightColumn.style.display === "flex") {
    rightColumn.style.display = "none";
  } else {
    rightColumn.style.display = "flex";
  }
  clearInput();
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayItems();
}

// Delete Task 
function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayItems();
}

// Close Description
function closeDescription() {
  var descriptionDisplay = document.getElementById("descriptionDisplay");
  descriptionDisplay.style.display = "none"; // Hide the description display
}

// Edit Task 
function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");
  inputElement.classList.add("edit-task");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();
  
  inputElement.addEventListener("blur", () => {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
      displayItems();
    }
  });
  
  inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const updatedText = inputElement.value.trim();
      if (updatedText) {
        todo[index].text = updatedText;
        saveToLocalStorage();
        displayItems();
      }
    }
  });
}

// Discard Tasks 
function clearInput() {
  const item = document.querySelector("#item");
  const deadline = document.querySelector("#deadline");
  const category = document.querySelector(".select-category");
  const description = document.querySelector(".description-input");
  
  item.value = "";
  deadline.value = "";
  category.value = "High Importance";
  description.value = "";
}

// Show the modal when the delete button is clicked
document.getElementById('delete').addEventListener('click', function() {
  document.getElementById('modal').style.display = 'block';
});

// Hide the modal when the cancel button is clicked
document.getElementById('cancel').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Handle the discard action
document.getElementById('discard').addEventListener('click', () => {
  // Remove the entire edit button container
  const container = document.getElementById('edit-button-container');
  if (container) {
    container.remove();
  }
  
  // Close the right column container
  toggleAddTask();
  
  // Hide the modal
  document.getElementById('modal').style.display = 'none';
});

// Save tasks to list
function saveToLocalStorage() {
  localStorage.setItem("items", JSON.stringify(todo));
}

window.onload = function () {
  displayItems();
};

// Initialize context menu
{
  const contextMenu = document.querySelector(".context");
  const todoDescription = document.querySelector("#descriptionText");
  
  const updateMenuPosition = (x, y) => {
      contextMenu.style.left = `${x}px`;
      contextMenu.style.top = `${y}px`;
      contextMenu.style.display = 'block';
  };

  elementId = null;

  document.addEventListener("contextmenu", (ev) => {
    if (ev.target.closest(".checkbox-list")) {
      elementId = ev.target.closest(".checkbox-list").id;
      ev.preventDefault(); // Prevent default context menu
      updateMenuPosition(ev.clientX, ev.clientY);
    }
  });
  
  // Hide the context menu
  document.addEventListener('click', () => {
    contextMenu.style.display = 'none'; 
  });
  
  document.getElementById('action1').addEventListener("click", () => {
    contextMenu.style.display = 'none'; 
    editTask(elementId);
  });
  
  document.getElementById('action2').addEventListener("click", () => {
    contextMenu.style.display = 'none';
    
    todoDescription.textContent = todo[elementId].description;
    const descriptionDisplay = document.querySelector(".description-display");
    descriptionDisplay.style.display = 'block';
  });

  document.getElementById('action3').addEventListener("click", () => {
    contextMenu.style.display = 'none'; 
    descriptionDisplay.style.display = 'none';
    deleteTask(elementId);
  });
}
