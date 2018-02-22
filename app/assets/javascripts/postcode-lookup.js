'use strict';

class postcodeLookup {
  constructor() {
    this.postcodeInput = document.querySelector('#postcode-search');
    this.postcodeList = document.querySelector('#postcodeAutocomplete');
    this.addressList = document.querySelector('#addressAutocomplete');
    this.enterManuallyLink = document.querySelector('#enterAddressManually');
    this.addressInputs = document.querySelectorAll('.addressInput');

    this.selectedPostcode = '';
    
    this.focusOnAddressLineOne = this.focusOnAddressLineOne.bind(this);
    this.findPostcode = this.findPostcode.bind(this);
    this.showPostcodes = this.showPostcodes.bind(this);
    this.selectPostcode = this.selectPostcode.bind(this);
    this.selectAddress = this.selectAddress.bind(this);
    this.populateAddress = this.populateAddress.bind(this);

    this.addEventListeners();
  }

  addEventListeners() {
    this.postcodeInput.addEventListener('keyup', this.findPostcode);
    this.enterManuallyLink.addEventListener('click', this.focusOnAddressLineOne);
  }

  focusOnAddressLineOne() {
    document.querySelector('#Address_AddressLine1').focus();
  }

  findPostcode(event) {
    // if nothing entered or deleted
    if (!event.target.value.length) {
      this.postcodeList.innerHTML = '';
      this.postcodeList.classList.remove('active');
      return false;
    }

    this.addressList.classList.remove('active');
    this.postcodeList.classList.add('active');

    fetch(`https://api.postcodes.io/postcodes/${event.target.value}/autocomplete`)
      .then(response => response.json())
      .then(postcodeData => this.showPostcodes(postcodeData));
  }

  showPostcodes(postcodeData) {
    if (!postcodeData.result) return; // invalid postcode.. TODO: show validation error

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
      this.postcodeList.classList.remove('active');
      this.selectAddress(postcodeData.result[0]);
    }
  }

  selectPostcode(event) {
    this.postcodeList.classList.remove('active');
    this.postcodeInput.value = event.target.innerHTML;
    this.selectAddress(event.target.innerHTML);
  }

  selectAddress(chosenPostcode) {
    this.addressList.classList.add('active');
    this.selectedPostcode = chosenPostcode;
    const addressArray = new Array(10).fill();
    const availableAddresses = addressArray.map(
      (address, i) =>
        `<li><a href="#${i + 8}_gracemere_cresent">${i + 8} Gracemere Cresent, Birmingham</a></li>`
    );
    this.postcodeList.innerHTML = '';
    this.addressList.innerHTML = availableAddresses.join('');
    this.addressList.addEventListener('click', this.populateAddress);
  }

  populateAddress(event) {
    this.postcodeList.classList.remove('active');
    this.addressList.classList.remove('active');

    const addressArray = event.target.innerHTML.split(', ');
    addressArray.push(this.selectedPostcode);

    document.querySelector('#Address_AddressLine1').value = addressArray[0] || '';
    if (addressArray.length === 4)
      document.querySelector('#Address_AddressLine2').value = addressArray[1] || '';
    if (addressArray.length === 5)
      document.querySelector('#Address_AddressLine3').value = addressArray[2] || '';
    document.querySelector('#Address_AddressLine4').value =
      addressArray[addressArray.length - 2] || '';
    document.querySelector('#Address_Postcode').value = addressArray[addressArray.length - 1] || '';
  }
}

new postcodeLookup();
