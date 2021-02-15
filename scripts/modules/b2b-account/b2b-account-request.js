define(["modules/jquery-mozu", "hyprlive", "modules/models-b2b-account",], function ($, Hypr, B2BAccountModels) {

  $(document).ready(function () {
    var isFormValid;

    var validateEmail = function (email) {
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailReg.test(email);
    }

    var validateInput = function () {
      isFormValid = true;
      // perform validation
      var formValues = $('#account-request').serializeArray();
      formValues.forEach(formValue => {

        var { name, value } = formValue;

        if (value == "" && name != "taxId") { // taxId is not a required field
          isFormValid = false;
          // show validation message
          $(`[data-mz-validationmessage-for="${name}"]`).show().text(Hypr.getLabel(`${name}Missing`));
        } else if (name == "userEmail" && !validateEmail(value)) {
          isFormValid = false;
          $(`[data-mz-validationmessage-for="${name}"]`).show().text(Hypr.getLabel(`${name}InValid`));
        } else {
          // hide the message
          $(`[data-mz-validationmessage-for="${name}"]`).hide();
        }
      });
    }

    var requestAccountApiCall = function () {
      // get value from form
      var requestAccount = JSON.parse(JSON.stringify({
        "users": [
          {
            "emailAddress": $("#userEmail").val(),
            "userName": $("#userEmail").val(),
            "firstName": $("#userFirstName").val(),
            "lastName": $("#userLastName").val(),
            "localeCode": "en-US",
            "acceptsMarketing": false,
            "isActive": false
          }
        ],
        "isActive": false,
        "status": "PendingApproval",
        "taxId": $("#taxId").val(),
        "parentAccountId": "",
        "companyOrOrganization": $("#companyName").val(),
        "accountType": "B2B"
      }));
      $("#requestAccount").addClass("is-loading");
      // create model
      var apib2bAccount = new B2BAccountModels.b2bAccount(requestAccount);
      // call api
      apib2bAccount.apiModel.create().then(function () {
        $("#requestAccount").removeClass("is-loading");
        displayApiMessage("success", "Account Request Sent Successfully.");
        // clear form
        $('#account-request')[0].reset();
      }, function (error) {
        $("#requestAccount").removeClass("is-loading");
        displayApiMessage("error", error.message);
      });
    }

    var displayApiMessage = function(messageType, message) {
      if(messageType == "error") {
        $('[data-mz-role="popover-message"]').html('<span class="mz-validationmessage">' + message + '</span>');
      } else {
        $('[data-mz-role="popover-message"]').html('<span>' + message + '</span>');  
      }
    }

    $("#account-request").submit(function (e) {
      e.preventDefault();
      validateInput();
      if (isFormValid) {
        requestAccountApiCall();
      }
    })
  })
});
