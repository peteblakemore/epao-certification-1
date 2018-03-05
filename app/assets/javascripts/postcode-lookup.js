"use strict";

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var postcodeLookup = (function() {
  function postcodeLookup() {
    _classCallCheck(this, postcodeLookup);

    this.postcodeInput = document.querySelector("#postcode-search");
    this.postcodeList = document.querySelector("#postcodeAutocomplete");
    this.addressList = document.querySelector("#addressAutocomplete");
    this.enterManuallyLink = document.querySelector("#enterAddressManually");
    this.addressInputs = document.querySelectorAll(".addressInput");

    this.selectedPostcode = "";

    this.focusOnAddressLineOne = this.focusOnAddressLineOne.bind(this);
    this.findPostcode = this.findPostcode.bind(this);
    this.showPostcodes = this.showPostcodes.bind(this);
    this.selectPostcode = this.selectPostcode.bind(this);
    this.selectAddress = this.selectAddress.bind(this);
    this.populateAddress = this.populateAddress.bind(this);

    this.addEventListeners();
  }

  _createClass(postcodeLookup, [
    {
      key: "addEventListeners",
      value: function addEventListeners() {
        this.postcodeInput.addEventListener("keyup", this.findPostcode);
        this.postcodeInput.addEventListener("paste", this.findPostcode);
        this.enterManuallyLink.addEventListener(
          "click",
          this.focusOnAddressLineOne
        );
      }
    },
    {
      key: "focusOnAddressLineOne",
      value: function focusOnAddressLineOne() {
        document.querySelector("#Address_AddressLine1").focus();
      }
    },
    {
      key: "findPostcode",
      value: function findPostcode(event) {
        var _this = this;

        // if nothing entered or deleted
        if (!event.target.value.length) {
          this.postcodeList.innerHTML = "";
          this.postcodeList.classList.remove("active");
          return false;
        }

        this.addressList.classList.remove("active");
        this.postcodeList.classList.add("active");

        // fetch(
        //   "https://api.postcodes.io/postcodes/" +
        //     event.target.value +
        //     "/autocomplete"
        // )
        //   .then(function(response) {
        //     return response.json();
        //   })
        //   .then(function(postcodeData) {
        //     return _this.showPostcodes(postcodeData);
        //   });

        var xmlhttp = new XMLHttpRequest();
        var url = "https://api.postcodes.io/postcodes/" + event.target.value + "/autocomplete";

        xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var postcodeData = JSON.parse(this.responseText);
            return _this.showPostcodes(postcodeData);
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();

      }
    },
    {
      key: "showPostcodes",
      value: function showPostcodes(postcodeData) {
        if (!postcodeData.result) return; // invalid postcode.. TODO: show validation error

        if (postcodeData.result.length > 1) {
          // listing postcodes
          var availablePostcodes = postcodeData.result.map(function(postcode) {
            return '<li><a href="#' + postcode + '">' + postcode + "</a></li>";
          });
          this.postcodeList.innerHTML = availablePostcodes.join("");
          this.postcodeList.addEventListener("click", this.selectPostcode);
        } else {
          // typed whole postcode
          this.postcodeInput.value = this.postcodeInput.value.toUpperCase();
          this.postcodeList.classList.remove("active");
          this.selectAddress(postcodeData.result[0]);
        }
      }
    },
    {
      key: "selectPostcode",
      value: function selectPostcode(event) {
        this.postcodeList.classList.remove("active");
        this.postcodeInput.value = event.target.innerHTML;
        this.selectAddress(event.target.innerHTML);
      }
    },
    {
      key: "selectAddress",
      value: function selectAddress(chosenPostcode) {
        this.addressList.classList.add("active");
        this.selectedPostcode = chosenPostcode;
        var addressArray = new Array(10).fill();
        var availableAddresses = addressArray.map(function(address, i) {
          return (
            '<li><a href="#' +
            (i + 8) +
            '_gracemere_cresent">' +
            (i + 8) +
            " Gracemere Cresent, Birmingham</a></li>"
          );
        });
        this.postcodeList.innerHTML = "";
        this.addressList.innerHTML = availableAddresses.join("");
        this.addressList.addEventListener("click", this.populateAddress);
      }
    },
    {
      key: "populateAddress",
      value: function populateAddress(event) {
        this.postcodeList.classList.remove("active");
        this.addressList.classList.remove("active");

        var addressArray = event.target.innerHTML.split(", ");
        addressArray.push(this.selectedPostcode);

        document.querySelector("#Address_AddressLine1").value =
          addressArray[0] || "";
        if (addressArray.length === 4)
          document.querySelector("#Address_AddressLine2").value =
            addressArray[1] || "";
        if (addressArray.length === 5)
          document.querySelector("#Address_AddressLine3").value =
            addressArray[2] || "";
        document.querySelector("#Address_AddressLine4").value =
          addressArray[addressArray.length - 2] || "";
        document.querySelector("#Address_Postcode").value =
          addressArray[addressArray.length - 1] || "";
      }
    }
  ]);

  return postcodeLookup;
})();

if (document.querySelector("#postcode-search")) {
  new postcodeLookup();
}