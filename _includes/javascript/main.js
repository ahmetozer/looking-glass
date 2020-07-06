function hasIPVersionRequired() {
  $(".ipMayRequired").find("option:selected").each(function () {
    if ($(this).attr("hasIPVersion") == "yes") {
      $("#IPVersion").show();
    } else {
      $("#IPVersion").hide();
    }
  });
}
function applyIPVersionRegex() {
  switch ($("#IPVersion").children("option:selected").val()) {
    case "Default": {
      $('#hostname').attr('pattern', domainRegex + "|" + ipv4Regex + "|" + ipv6Regex)
    }
    case "IPv4": {
      $('#hostname').attr('pattern', domainRegex + "|" + ipv4Regex)
    }
    case "IPv6": {
      $('#hostname').attr('pattern', domainRegex + "|" + ipv6Regex)
    }
  }
}

function isMobile() {
  if ( $(window).width() > '991') {
    return false;
  } else {
    return true;
	} 
}

$(".ipMayRequired").change(function () {
  hasIPVersionRequired()
}).change();


$("#IPVersion").change(function () {
  applyIPVersionRegex()
}).change();

$("#funcFrame").on("load", function () {
  $("#loadingCircle").hide()
});


if (isMobile()) {
  $("#isMobile").val("1");
}
function lgIframeRun() {
  var svURL = $("#" + Cookies.get('SelectedServerID')).data("svurl");
  if (svURL && svURL != "") {
    $("#loadingCircle").show();
    $('#runButton').prop('disabled', true);
    $("#funcCard").show()
    $('#funcFrame').attr('src', svURL + "/looking-glass-controller" + "?" + $("#lg_run_form").serialize())
  } else {
    $('#serverSelectModal').modal('toggle')
  }
  setTimeout(() => {  $('#runButton').prop('disabled', false); }, 1200);
}
