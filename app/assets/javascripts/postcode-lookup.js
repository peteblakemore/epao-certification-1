'use strict';

class postcodeLookup {
  constructor() {
    this.postcodeInput = document.querySelector('#postcode-search');
    this.postcodeList = document.querySelector('#postcodeAutocomplete');
    this.addressList = document.querySelector('#addressAutocomplete');
    this.enterManuallyLink = document.querySelector('#enterAddressManually');
    this.addressInputs = document.querySelectorAll('.addressInput');

    this.selectedPostcode = '';

    this.findPostcode = this.findPostcode.bind(this);
    this.showPostcodes = this.showPostcodes.bind(this);
    this.selectPostcode = this.selectPostcode.bind(this);
    this.selectAddress = this.selectAddress.bind(this);
    this.populateAddress = this.populateAddress.bind(this);

    this.addEventListeners();
  }

  addEventListeners() {
    this.postcodeInput.addEventListener('keyup', this.findPostcode);
    this.enterManuallyLink.addEventListener('click', this.hidePostcodeSearch);
  }

  hidePostcodeSearch() {
    document.querySelector('#address-lookup').innerHTML = '';
  }

  findPostcode(event) {
    this.addressList.innerHTML = '';
    this.postcodeList.classList.remove('visuallyhidden');
    if (!event.target.value.length) return;

    fetch(`https://api.postcodes.io/postcodes/${event.target.value}/autocomplete`)
      .then(response => response.json())
      .then(postcodeData => this.showPostcodes(postcodeData));
  }

  showPostcodes(postcodeData) {
    if (!postcodeData.result) return; // invalid postcode.. show validation error

    if (postcodeData.result.length > 1) {
      // listing postcodes
      const availablePostcodes = postcodeData.result.map(
        postcode => `<li><a href="#${postcode}">${postcode}</a></li>`
      );
      this.postcodeList.innerHTML = availablePostcodes.join('');
      this.postcodeList.addEventListener('click', this.selectPostcode);
    } else {
      // typed whole postcode
      this.postcodeInput.value = this.postcodeInput.value.toUpperCase();
      this.postcodeList.classList.add('visuallyhidden');
      this.selectAddress(postcodeData.result[0]);
    }
  }

  selectPostcode(event) {
    this.postcodeList.classList.add('visuallyhidden');
    this.postcodeInput.value = event.target.innerHTML;
    this.selectAddress(event.target.innerHTML);
  }

  selectAddress(chosenPostcode) {
    this.selectedPostcode = chosenPostcode;
    const addressArray = new Array(10).fill();
    const availableAddresses = addressArray.map(
      (address, i) =>
        `<li><a href="#${i + 2}_orchard_cresent">${i +
          2} Orchard Cresent, Cheylesmore, Coventry, West Midlands</a></li>`
    );
    this.postcodeList.innerHTML = '';
    this.addressList.innerHTML = availableAddresses.join('');
    this.addressList.addEventListener('click', this.populateAddress);
  }

  populateAddress(event) {
    this.postcodeList.innerHTML = '';
    this.addressList.innerHTML = '';
    const addressArray = event.target.innerHTML.split(', ');
    addressArray.push(this.selectedPostcode);
    this.addressInputs.forEach((input, index) => (input.value = addressArray[index]));
  }
}

new postcodeLookup();
