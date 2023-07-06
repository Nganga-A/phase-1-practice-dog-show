// Fetch the registered dogs and populate the table on page load
window.addEventListener('load', () => {
    fetch('http://localhost:3000/dogs')
      .then(response => response.json())
      .then(dogs => {
        const tableBody = document.getElementById('table-body');
        dogs.forEach(dog => {
          const row = createTableRow(dog);
          tableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error fetching dogs:', error);
      });
  });
  
  // Create a table row for a dog
  function createTableRow(dog) {
    const row = document.createElement('tr');
  
    const nameCell = document.createElement('td');
    nameCell.textContent = dog.name;
    row.appendChild(nameCell);
  
    const breedCell = document.createElement('td');
    breedCell.textContent = dog.breed;
    row.appendChild(breedCell);
  
    const sexCell = document.createElement('td');
    sexCell.textContent = dog.sex;
    row.appendChild(sexCell);
  
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      populateForm(dog);
    });
    editCell.appendChild(editButton);
    row.appendChild(editCell);
  
    return row;
  }
  
  // Populate the form with dog's current information
  function populateForm(dog) {
    const form = document.getElementById('dog-form');
    form.elements.name.value = dog.name;
    form.elements.breed.value = dog.breed;
    form.elements.sex.value = dog.sex;
  }
  
  // Handle form submission
  document.getElementById('dog-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
  
    const dogId = getDogIdFromForm(); // Implement this function to extract the dog ID from the form or elsewhere
    const updateData = {
      name: form.elements.name.value,
      breed: form.elements.breed.value,
      sex: form.elements.sex.value
    };
  
    fetch(`http://localhost:3000/dogs/${dogId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error updating dog');
      }
    })
    .then(() => {
      // Clear the form after successful update
      form.reset();
      
      // Fetch all dogs again to update the table with the latest data
      fetch('http://localhost:3000/dogs')
        .then(response => response.json())
        .then(dogs => {
          const tableBody = document.getElementById('table-body');
          tableBody.innerHTML = ''; // Clear the table body
          dogs.forEach(dog => {
            const row = createTableRow(dog);
            tableBody.appendChild(row);
          });
        })
        .catch(error => {
          console.error('Error fetching dogs:', error);
        });
    })
    .catch(error => {
      console.error('Error updating dog:', error);
    });
  });
  