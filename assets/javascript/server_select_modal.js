showAllListStat = "no";
var currentServerConfig
// Show All Servers On List in Modal
function listAllToggleToShow() {
  if (showAllListStat == "no") {
    $('#serverList').find('.collapse').collapse('show')
    showAllListStat = "yes"
    $("#showAllLgList")
      .html("Hide all")
      .removeClass('btn-outline-info')
      .addClass('btn-outline-warning');
  } else {
    var itemId = localStorage.SelectedServerID
    if (itemId != null && itemId != "") {
      $('.collapse').not($('#' + itemId).parents()).collapse('hide')
      $('#' + itemId).parents().collapse('show')
    } else {
      $('#serverList').find('.collapse').collapse('hide')
    }
    showAllListStat = "no"
    $("#showAllLgList")
      .html("Show all")
      .addClass('btn-outline-info')
      .removeClass('btn-outline-success')
      .removeClass('btn-outline-warning');
  }
}

// Clear Server Selection
function ListServerSelectDelete() {
  localStorage.removeItem('SelectedServerID')
  svButtonLoadSave()
}

// Apply Server Config to Front End
function svApplyConfig(config) {
  for (confIndex in config) {
    if (config[confIndex] == "enabled") {
      $("#lgSVconF" + confIndex).prop('disabled', false);
      $("#lgSVconF" + confIndex).removeClass("d-none");
    } else {
      $("#lgSVconF" + confIndex).prop('disabled', true);
      $("#lgSVconF" + confIndex).addClass("d-none");
    }
  }
  if (config["IPv4"] != "enabled" || config["IPv6"] != "enabled") {
    $("#lgSVconFIPvDefault")
      .prop('disabled', true)
      .addClass("d-none");
  } else {
    $("#lgSVconFIPvDefault").prop('disabled', false)
      .removeClass("d-none");
  }
  svTableFill($("#"+localStorage.SelectedServerID))
  // after applying config run auto selection.
  autoSelectOptions()
}


//
function svButtonLoadSave(itemId) {
  if (itemId != null && itemId != "") {
    $('.collapse').not($('#' + itemId).parents()).collapse('hide')
    $('#' + itemId).parents().collapse('show')
    $('#' + itemId).addClass('list-group-item-info')

    $(".serverSelectButton")
      .html('<i class="fas fa-server"></i> '+$('#' + itemId).data("svname"))
      .addClass('btn-secondary').removeClass('btn-danger');
    currentServerConfig = $('#' + itemId).data("svconf");
    svApplyConfig(currentServerConfig);
  } else {
    $("#serverList")
      .find('.collapse').collapse('hide')
      .find('.lgserver').removeClass('list-group-item-info');
    $(".serverSelectButton")
      .html("Please Select Server")
      .addClass('btn-danger').removeClass('btn-secondary');
  }
}

// When the server clicked , Run these. "svButtonTrigger()"
function svButtonTrigger() {
  $(function () {
    $('.server-list-group-item').on('click', function () {
      $('.collapse').not($(this).parents('')).collapse('hide');
      if (showAllListStat == "yes") {
        $("#showAllLgList")
          .html("Show current")
          .addClass('btn-outline-success')
          .removeClass('btn-outline-warning');
        //$(this).collapse("show")
      }
    });
  });
  $(function () {
    $('.lgserver').on('click', function () {
      if (showAllListStat == "yes") {
        $('.collapse').not($(this).parents('')).collapse('hide');
        $("#showAllLgList")
          .html("Show all")
          .addClass('btn-outline-info')
          .removeClass('btn-outline-success')
          .removeClass('btn-outline-warning');
        showAllListStat = "no"
      }
      $('.lgserver').removeClass('list-group-item-info')
      // Save current server info to local disk
      localStorage.setItem("SelectedServerID",$(this).attr('id'))
      //change button info
      //$(".serverSelectButton").html($(this).data("svname"));
      // Apply config
      currentServerConfig = $(this).data("svconf");
      svApplyConfig(currentServerConfig);

      //svApplyConfig($(this).data( "svconf" ))
      //$('.serverSelectButton').addClass('btn-dark').removeClass('btn-danger');
      $(this)
        .toggleClass('list-group-item-info')
        .toggleClass('');
      svButtonLoadSave(localStorage.SelectedServerID)
    });
  });
}
// END of the "svButtonTrigger()"

// Compare Nested Configs with Recursive , "svConfigComparisor"
function svConfigComparisor(oldConfig, newConfig) {
  var tempConfig = { ...oldConfig };
  var tempConfig2 = { ...newConfig };
  for (confIndex in oldConfig) {
    //console.log("index = "+index)
    if (typeof oldConfig[confIndex] == "object" && typeof tempConfig2[confIndex] == "object") {
      tempConfig[confIndex] = svConfigComparisor(oldConfig[confIndex], tempConfig2[confIndex])
    } else {
      if (newConfig[confIndex]) {
        tempConfig[confIndex] = tempConfig2[confIndex]
      }
    }
  }
  return tempConfig
}
// End of the "svConfigComparisor"
function arrToDashString(incomingArray) {
  //return
  var tempString = ""
  for (item in incomingArray) {
    if (tempString == "") {
      tempString = incomingArray[item]
    } else {
      tempString = tempString + "-" + incomingArray[item]
    }

  }
  //console.log(tempString)
  return tempString
}

function arrToDotString(incomingArray) {
  //return
  var tempString = ""
  for (item in incomingArray) {
    if (tempString == "") {
      tempString = incomingArray[item]
    } else {
      tempString = tempString + "." + incomingArray[item]
    }

  }
  //console.log(tempString)
  return tempString
}

// Load Looking Glass Server List
function lgServerListLoad(data, Config, depth) {
  // Check maximum Depth
  if (depth != null && typeof depth == "object") {
    if (depth.length > 6) { console.log("You are reach maximum depth of server list. Please keep list depth at maximum 5."); return } // If is not check 5 because modal id exist in array
  } else { console.log("Depth is not array"); return }

  //var curIndex = 1;
  for (index in data) {
    var curIndex = index
    //console.log("Old config for "+index,Config)

    // Check if has a config or not. If element has a config then make a Compare
    if (data[index]["ServerConfig"]) {
      var curConfig = svConfigComparisor(Config, data[index]["ServerConfig"])
    } else {
      var curConfig = Config
    }

    // If name not exist, get Json Object name
    if (typeof data[index]["Name"] == "undefined" && data[index]["Name"] != "") {
      var lgSvName = index;
    } else {
      var lgSvName = data[index]["Name"];
    }

    // Control If Server Description Exist
    if (typeof data[index]["Description"] == "undefined") {
      var lgSVDescription = "";
    } else {
      var lgSVDescription = data[index]["Description"];
    }

    // Check Data type, It might be nested list or Server
    if (data[index]["JsonURL"]) {
      //lgServerListLoadAjax(data[index]["JsonURL"],depth,curIndex);
      console.log("Currently Nested Json List is not Supported")
    } else if (typeof data[index]["Servers"] == "object") {// Look is a list or Server, If its list it returns object if not return undefined.
      // Do for list items, First create list item after run recursive
      //console.log("This is a list "+lgSvName,returnTempArr(depth,curIndex)) // For debugging
      var tempDepth = Object.assign([], depth)
      tempDepth.push(curIndex)
      //console.log(depth,tempDepth)
      $("#" + arrToDashString(depth)).append(`<button href="#` + arrToDashString(tempDepth) + `" class="server-list-group-item list-group-item list-group-item-action btn btn-dark" data-toggle="collapse"><i class="fas fa-list text-dark"></i> ` + lgSvName + `<small class="text-muted float-right">` + lgSVDescription + `</small></button><div class="list-group collapse" id="` + arrToDashString(tempDepth) + `"> `);
      // Recursive Call
      lgServerListLoad(data[index]["Servers"], curConfig, tempDepth)
      $("#" + arrToDashString(depth)).append(`</div>`);

    } else if (data[index]["Url"]) {
      // Do for server items
      var tempDepth = Object.assign([], depth)
      tempDepth.push(curIndex)
      //console.log("This is a server "+lgSvName,tempDepth) // for debugging
      var listIcons = ""
      var serverDisabled = ""
      if (data[index]["ASN"]) {
        listIcons = listIcons + '	&nbsp; <span class="badge badge-light">' + data[index]["ASN"] + '</span> '
      }

      if (curConfig["IPv4"] == "enabled" || curConfig["IPv6"] == "enabled") {
        if (curConfig["IPv4"] == "enabled" && curConfig["IPv6"] == "enabled") {
          listIcons = listIcons + '<font class="server-list-feature-icons text-success" data-toggle="tooltip" data-placement="top" title="IPv4 and IPv6 Connection">DS</font>'
        } else if (curConfig["IPv4"] == "enabled") {
          listIcons = listIcons + '<font class="server-list-feature-icons text-muted" data-toggle="tooltip" data-placement="top" title="IPv4 OnlyConnection">IPv4</font>'
        } else {
          listIcons = listIcons + '<font class="server-list-feature-icons text-warning" data-toggle="tooltip" data-placement="top" title="IPv6 Only Connection">IPv6</font>'
        }

      } else {
        serverDisabled = "disabled"
      }
      // Currently SpeedTest Service is not avaible.
      // if(curConfig["speedtest"] == "enabled") {
      //   listIcons = listIcons + '<i class="fas fa-tachometer-alt server-list-feature-icons text-dark" data-toggle="tooltip" data-placement="top" title="SpeedTest"></i>'
      // }
      if (curConfig["tracert"] == "enabled") {
        listIcons = listIcons + '<i class="fas fa-road server-list-feature-icons text-muted" data-toggle="tooltip" data-placement="top" title="TraceRoute"></i>'
      }
      $("#" + arrToDashString(depth)).append(`<button class="server-list-group-item list-group-item list-group-item-action btn btn-light lgserver"` + serverDisabled + ` data-svjson='` + JSON.stringify(data[index]) + `' data-svName='` + lgSvName + `' data-svloc='`+arrToDotString(tempDepth).replace("serverList.", "")+`' data-svconf='` + JSON.stringify(curConfig) + `' id="` + arrToDashString(tempDepth) + `"><i class="fas fa-server text-primary"></i>` + lgSvName +
        listIcons +
        `<small class="text-muted float-right">` + lgSVDescription + `</small></button>`);

    } else {
      console.log("Error: " + arrToDashString(depth) + " " + index + " is unknown type of server.")
    }
    // Current index location in for, increase every item in loop
    //curIndex = curIndex+1
  } // for loop end
}
// End of the "lgServerListLoad"

// Get server list with ajax
function lgServerListLoadAjax(URL, curIndex) {
  $.ajax({
    url: URL,
    dataType: 'json',
    success: function (data) {
      localStorage.setItem("server_js", JSON.stringify(data));
      lgServerListLoad(data["Servers"], svConfigComparisor(default_server_config["ServerConfig"], data["ServerConfig"]), ["serverList"]);
      // After getting server data, start button services.
      svButtonTrigger();
      svButtonLoadSave(localStorage.SelectedServerID)
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
    },
    error: function (data) {
      $(".server-list-group").html(JSON.stringify(data));
      $(".serverSelectButton").html("ERR,Click more info");
      if (data["status"] == 200) {
        console.log('ERROR: ', "Json Parse Error");
        $("#serverSelectLabel").html("Json Parse Error");
      } else if (data["status"] == 404) {
        console.log('ERROR: ', "Json not found");
        $("#serverSelectLabel").html("Json not found in "+server_json_url);
      } else {
        $("#serverSelectLabel").html("Unknown error, for more details please look Developer Console 'F12' ");
        console.log('Unknown error, here is more details: ', data);
      }

    }
  });
}
if (typeof(Storage) !== "undefined") {
  // Code for localStorage/sessionStorage.
  lgServerListLoadAjax(server_json_url, 0);
} else {
  // Sorry! No Web Storage support..
  $('.serverSelectButton').prop('disabled', true);
  $(".serverSelectButton").html("Sorry! No Web Storage support.");
}