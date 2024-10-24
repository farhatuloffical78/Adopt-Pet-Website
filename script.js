// get year function
function getYearFromDateString(dateStr) {
    const date = new Date(dateStr);
    return date.getFullYear();
  }
  // display all the data
  const fetchAllCategorybtn= async()=>{
  const res = await fetch('https://openapi.programming-hero.com/api/peddy/categories');
  const data = await res.json();
  displayButton(data.categories)
  }
  
  // display category button 
  
  const displayButton = (catagoryButton) => {
    const buttonContainer = document.getElementById('displaybtn');
    buttonContainer.innerHTML = ''; 
  
    catagoryButton.forEach(catagory => {
      const btn = document.createElement('div');
      btn.innerHTML = `
        <button class="btn bg-white text-base md:text-xl text-[#131313] h-10 w-30 font-bold lg:h-16 lg:w-52 border mb-2 border-gray-300" 
                onclick="handleButtonClick(this, '${catagory.category}')">
            <img src="${catagory.category_icon}" class="lg:h-10 h-5" alt="">
            <p>${catagory.category}</p>
        </button> 
      `;
      buttonContainer.appendChild(btn);
    });
  };
  let activeButton = null; 
  
  const handleButtonClick = (button, category) => {
  
    if (activeButton) {
      activeButton.style.border = ''; 
      activeButton.style.borderRadius = ''; 
      activeButton.style.background = ''; 
    }
  
    // Set new active button styles
    button.style.border = '1.5px solid rgb(14, 122, 129)';
    button.style.borderRadius = '120px';
    button.style.background = 'rgba(14, 122, 129, 0.1)';
  
    activeButton = button; 
    fetchAndDisplayCategoryData(category);
  };
  
  
  const fetchAndDisplayCategoryData = async (category) => {
    const spinner = document.getElementById('spinner');
    const cardContainer = document.getElementById('card');
    const imageContainer = document.getElementById('imagedisplay');
    const defaultMessage = document.getElementById('defaultMessage');
  
  
    spinner.style.display = 'block';
    defaultMessage.classList.remove('hidden');
    cardContainer.style.display = 'none';
    imageContainer.style.display = 'none'; 
  
    setTimeout(async () => {
      
      await fetchAllCard(category); 
      spinner.style.display = 'none'; 
      defaultMessage.classList.add('hidden'); 
      cardContainer.style.display = 'grid'; 
      imageContainer.style.display = 'block';
    }, 2000); 
  };
  
  // all card display api fetch
  let petsDetails = [];
  const fetchAllCard = async (category = null) => {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
        const data = await res.json();
        petsDetails = data.pets; 
        const filteredPets = category ? petsDetails.filter(pet => pet.category === category) : petsDetails;
        displayCard(filteredPets);
    } catch (error) {
        console.error('Error fetching pet data:', error);
    }
  };
  
  
  // Function to display cards
  const displayCard = (petsDetails) => {
    const cardContainer = document.getElementById('card');
  
    const gridContainer = document.getElementById('grid-container');
    const emptyContainer = document.getElementById('emptycontain');
    cardContainer.innerHTML = '';
    if (petsDetails.length === 0) {
      gridContainer.classList.add('hidden');
      emptyContainer.classList.remove('hidden');
    } else {
      gridContainer.classList.remove('hidden');
      emptyContainer.classList.add('hidden');
  
      petsDetails.forEach(pet => {
        const card = document.createElement('div');
        card.innerHTML = `
            <div class="card card-compact bg-base-100 w-86 border border-gray-200">
                <div class="rounded-lg p-4">
                    <figure class="h-64">
                        <img
                            src=${pet.image}
                            class="h-full w-full object-cover rounded-lg"
                            alt="Pet Image" />
                    </figure>
                </div>
                <div class="p-4">
                    <h2 class="text-[#131313] font-bold text-xl mb-2">${pet.pet_name}</h2>
                    <div class="px-0 py-2 flex gap-2 items-start">
                        <div class="flex flex-col gap-1">
                            <i class="fa-solid fa-border-all text-lg"></i>
                            <i class="fa-regular fa-calendar-days text-lg"></i>
                            <i class="fa-solid fa-mercury text-lg"></i>
                            <i class="fa-solid fa-dollar-sign text-lg"></i>
                        </div>
                        <div class="flex flex-col gap-2">
                            <h2 class="font-bold text-[#131313B3] opacity-90">Breed: ${pet.breed ? pet.breed : "Not Available"}</h2>
                            <h2 class="font-bold text-[#131313B3] opacity-90">Birth: ${pet.date_of_birth ? getYearFromDateString(pet.date_of_birth) : "Not Available"}</h2>
                            <h2 class="font-bold text-[#131313B3] opacity-90">Gender: ${pet.gender ? pet.gender : "Not Available"}</h2>
                            <h2 class="font-bold text-[#131313B3] opacity-90">Price: ${pet.price ? pet.price + '$' : 'Not Available'}</h2>
                        </div>
                    </div>
                    <hr class="border-t-1 border-gray-300 pl-5 pr-5 pt-5">
                    <div class="flex justify-between">
                        <button onclick="likeImage(['${pet.image}'])" class="h-10 w-16 rounded-lg bg-white border border-gray-300 text-lg">
                            <i class="fa-solid fa-thumbs-up"></i>
                        </button>
                        <button id="adoptButton" class="h-10 w-28 rounded-lg bg-white border font-bold text-[#0E7A81] border-gray-300 text-lg hover:bg-[#0E7A81] hover:text-white" onclick="adoptforModal(event)">Adopt</button>
                        <button class="h-10 w-28 md:rounded-lg bg-white border text-[#0E7A81] font-bold border-gray-300 text-lg hover:bg-[#0E7A81] hover:text-white" onclick="infoForModal(${pet.petId})">Details</button>
                    </div>
                </div>
            </div>`;
        cardContainer.appendChild(card);
    });
    }
  };
  // Fetch all pet data and display cards initially
  fetchAllCard();
  document.querySelector('#btn').addEventListener('click', () => {
    const spinner = document.getElementById('spinner');
    const cardContainer = document.getElementById('card');
    const imageContainer = document.getElementById('imagedisplay');
    const defaultMessage = document.getElementById('defaultMessage'); 
    spinner.style.display = 'block';
    defaultMessage.classList.remove('hidden'); 
    cardContainer.style.display = 'none'; 
    imageContainer.style.display = 'none'; 
  
    const sortedPetsDetails = petsDetails.sort((a, b) => b.price - a.price);
    setTimeout(() => {
   
      cardContainer.innerHTML = ''; 
      displayCard(sortedPetsDetails);
  
      spinner.style.display = 'none'; 
      defaultMessage.classList.add('hidden'); 
      cardContainer.style.display = 'grid';
      imageContainer.style.display = 'block'; 
    }, 2000);
  });
  
  
  // side card function
  
  let column1Images = [];
  let column2Images = []; 
  
  const likeImage = (img) => {
  
    if (column1Images.length === column2Images.length) {
      column1Images.push(img); 
    } else {
      column2Images.push(img); 
    }
    displayImages(); 
  };
  
  const displayImages = () => {
    const column1 = document.getElementById('column1');
    const column2 = document.getElementById('column2');
    
  
    column1.innerHTML = '';
    column2.innerHTML = '';
  
    // Display images in column 1
    column1Images.forEach(img => {
      const imgDiv = document.createElement('div');
      imgDiv.classList.add('border', 'border-gray-200','p-2','mb-2', 'rounded-lg');
      imgDiv.innerHTML = `
  
        <img src="${img}" class="w-[180px] md:w-[150px] mb-0 h-auto object-cover rounded-lg" alt="Pet Image">
      `;
      column1.appendChild(imgDiv);
    });
  
    // Display images in column 2
    column2Images.forEach(img => {
      const imgDiv = document.createElement('div');
      imgDiv.classList.add('border', 'border-gray-200','p-2','mb-2','rounded-lg');
    
      imgDiv.innerHTML = `
        <img src="${img}" class="w-[180px] md:w-[150px] mb-0 h-auto object-cover rounded-lg" alt="Pet Image">
      `;
      column2.appendChild(imgDiv);
    });
  };
  
  // show details button modal
  const infoForModal=async(id)=>{
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${id}`);
    const data = await res.json();
    displaydetails(data.petData)
  
  }
  // adopt modal
  const adoptforModal = async (event) => {
    const adoptButton = event.target;
    adoptButton.disabled = true;  
    adoptButton.classList.add('opacity-50', 'bg-gray-300', 'text-gray-500', 'cursor-not-allowed');  
    adoptButton.textContent = 'adopted';
    const modal = document.getElementById('adoptionModal');
    modal.showModal();
  
  
    let countdownValue = 3;
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = countdownValue;
  
    const countdownInterval = setInterval(() => {
      countdownValue--;
      countdownElement.textContent = countdownValue;
  
      if (countdownValue === 1) {
        clearInterval(countdownInterval);
        setTimeout(() => {
          modal.close();  
        }, 500);  
      }
    }, 1000);
  };
  
  
  
  // display modal of specific pet
  const displaydetails = (petDatas) => {
    const modal = document.getElementById('modaldetails');
    document.getElementById('customModal').showModal();
    modal.innerHTML = ''; 
  modal.innerHTML=`
  
  <div>
         <img src="${petDatas.image}" class="w-full h-[300px] md:h-[500px] mb-3 object-cover rounded-lg" alt="">
          <h1 class="font-bold text-2xl mb-3  text-[#131313]">${petDatas.pet_name}</h1>
        </div>
        <div class="grid grid-cols-2 mb-5 "> 
          <div>
            <div class="flex gap-2">
              <i class="fa-solid fa-border-all text-lg"></i>
              <h1 class="text-[#131313] text-opacity-70 font-semibold">Breed : ${petDatas.breed?petDatas.breed:"Not Available"}</h1>
            </div>
            <div class="flex gap-2">
              <i class="fa-solid fa-mercury text-lg"></i>
              <h1 class="text-[#131313] text-opacity-70 font-semibold">Gender : ${petDatas.gender?petDatas.gender:"Not Available"}</h1>
            </div>
            <div class="flex gap-2">
             <i class="fa-solid fa-mercury text-lg"></i>
              <h1 class="text-[#131313] text-opacity-70 font-semibold">Vaccinated_status : ${petDatas.vaccinated_status}</h1>
            </div>
          </div>
          
          <div>
            <div class="flex gap-2">
              <i class="fa-regular fa-calendar-days text-lg"></i>
              <h1 class="text-[#131313] text-opacity-70 font-semibold">Birth : ${petDatas.date_of_birth? getYearFromDateString(petDatas.date_of_birth) : "Not Available"}</h1>
            </div>
            <div class="flex gap-2">
              <i class="fa-solid fa-dollar-sign text-lg"></i>
              <h1 class="text-[#131313] text-opacity-70 font-semibold">Price : ${petDatas.price?petDatas.price + '$':"Not Available"}</h1>
            </div>
          </div>
        </div>
  
        <hr class="border-t-1 border-gray-300 mb-3  mr-5">
        <div class="">
          <h1 class="font-bold text-xl mb-3 text-[#131313]">Detail Information</h1>
          <p class="text-[#131313] text-opacity-70 mb-5 font-semibold">${petDatas.pet_details}</p>
          
          <button  class="btn mb-5 w-full text-[#0E7A81] text-lg border border-[#0E7A81] border-opacity-20 rounded-lg bg-[#0E7A81] bg-opacity-10" onclick="document.getElementById('customModal').close()">Cancel</button>
        </div>
  
  `
  
  };
  
  // call globally
  fetchAllCategorybtn();
  
  