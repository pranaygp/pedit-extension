var dataHandle = new Firebase("http://pedit.firebaseio.com/");
var extensionId = chrome.runtime.id;
var url = document.location.href;
url = url.replace(/\./g,'/');
var initial = true;

$("body").append("<div id='pedit-overlay'></div>");

$("#pedit-overlay")
    .css({
    'display':'none',
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'background-color': 'white',
    'border-radius':'5px',
    'margin':'0 auto',
    'left':'50%',
    'transform':'translateX(-50%)',
    'padding':'5px',
    'z-index': 5000
}).load("chrome-extension://"+extensionId+"/popup.html", function(){
    $("#pedit-body [data-extension-src]").each(function(){
        $(this).prop("src", "chrome-extension://" + extensionId + "/" + $(this).data("extension-src"));
    });
    $("#pedit-body").css({
        "font-family":" 'HelveticaNeue-Thin'",
        "font-size":" 14px",
        "color":" #000000",
        "line-height":" 17px"
    });
    $("#pedit-body h1 ").css({
        "margin-top":" 12px",
        "font-family":" HelveticaNeue-Thin",
        "font-size":" 24px",
        "color":" #1792FF",
        "line-height":" 29px",
        "font-weight":" 100"
    });
    $("#pedit-body div ").css({
        "float":" left",
        "margin":" 10px"
    });
    $("#pedit-body label").css({
        "font-size":" 14px",
        "width":" 108px",
        "text-align":" right",
        "display":" inline-block"
    });
    $("#pedit-body #login label ").css({
        "font-size":" 14px",
        "width":" 58px"
    });
    $("#pedit-body input").css({
        "width":"auto",
        "margin-bottom":" 8px",
        "padding":" 4px"
    });
});

function setupPeditSubmitFunctionality(){
    $("#pedit-body input").keypress(function(e){
        if(e.keyCode==13){
            if(initial){
                var initialPassword = $(".pedit-password-field#initialPassword").val();
                var confirmPassword = $(".pedit-password-field#confirmPassword").val();
                if(initialPassword == confirmPassword){
                    dataHandle.child(url).update({password:md5(initialPassword)});
                    gotoConfirmationPage();
                }
                else{
                    alert("Passwords Don't Match");
                }
            } else {
                var password = $(".pedit-password-field#password").val();
                dataHandle.child(url).child("password").once('value',function(snapshot){
                    if(snapshot.val() == md5(password))
                        gotoConfirmationPage();
                    else{
                        alert("Password isn't right");
                    }
                });
            }
        }
    })
}

dataHandle.child(url).child("password").once("value", function(snapshot) {
    var data = snapshot.val();
    if(data == null){
        initial = true;
        $("#pedit-overlay #initialRun").show();
    }
    else{
        initial = false;
        $("#pedit-overlay #login").show();
    }
    setupPeditSubmitFunctionality();
    $("#pedit-overlay").fadeIn();
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    alert("An error occurred. Please contact developer.");
});

function gotoConfirmationPage(){
    if(initial){
        $("#pedit-overlay #initialRun").hide();
        initial = false;
    } else {
        $("#pedit-overlay #login").hide();
    }
    $("#pedit-overlay #confirm").fadeIn();
    $("#pedit-overlay").delay(5000).fadeOut();
    makeDataEditable();
}

function makeDataEditable(){
    $("[data-pedit]").prop("contenteditable","true");
}
