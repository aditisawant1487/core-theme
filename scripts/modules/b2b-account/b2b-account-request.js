define(["modules/jquery-mozu", "hyprlive", "modules/models-b2b-account", 'hyprlivecontext'], function ($, Hypr, B2BAccountModels, HyprLiveContext) {

  $(document).ready(function () {
    var isFormValid;

    function isEmailValid(email) {
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailReg.test(email);
    }

    function validateInput() {
      isFormValid = true;
      // perform validation
      var formValues = $('#account-request').serializeArray();
      formValues.forEach(formValue => {
        var { name, value } = formValue;

        if (value == "" && name != "taxId") { // taxId is not a required field
          isFormValid = false;
          // show validation message
          $(`[data-mz-validationmessage-for="${name}"]`).show().text(Hypr.getLabel(`${name}Missing`));
        } else if (name == "userEmail" && !isEmailValid(value)) {
          isFormValid = false;
          $(`[data-mz-validationmessage-for="${name}"]`).show().text(Hypr.getLabel(`${name}InValid`));
        } else {
          // hide the message
          $(`[data-mz-validationmessage-for="${name}"]`).hide();
        }
      });
    }

    function showErrorMessage(message) {
      $('[data-mz-role="popover-message"]').html('<span class="mz-validationmessage">' + message + '</span>');
    }

    function showSuccessMessage() {
      $('#b2b-success-modal').css('display', 'block');
    }

    function requestAccountApiCall() {
      $("#requestAccount").addClass("is-loading");
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
      // create model
      var apib2bAccount = new B2BAccountModels.b2bAccount(requestAccount);
      // call api
      apib2bAccount.apiModel.create().then(function () {
        $("#requestAccount").removeClass("is-loading");
        // clear form
        $('#account-request')[0].reset();
        showSuccessMessage();
      }, function (error) {
        $("#requestAccount").removeClass("is-loading");
        showErrorMessage(error.message);
      });
    }

    $('#b2b-close-modal').click(function() {
      $('#b2b-success-modal').css('display', 'none');
      window.location.href = "/";
    })

    $("#account-request").submit(function (e) {
      e.preventDefault();
      validateInput();
      if (isFormValid) {
        requestAccountApiCall();
      }
    })
  })
});
