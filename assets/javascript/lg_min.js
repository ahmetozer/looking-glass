var currentServerConfig,default_server_config=JSON.parse('{"ServerConfig":{"whois":"disabled","nslookup":"disabled","ping":"disabled","icmp":"disabled","tracert":"disabled","webcontrol":"disabled","tcp":"disabled","IPv6":"disabled","IPv4":"disabled","curl":"disabled","mtr":"disabled"}}');function applyIPVersionRegex(e){switch(e){case"IPv4":$("#hostname").attr("pattern",domainRegex+"|"+ipv4Regex);break;case"IPv6":$("#hostname").attr("pattern",domainRegex+"|"+ipv6Regex);break;case"IPvDefault":$("#hostname").attr("pattern",domainRegex+"|"+ipv4Regex+"|"+ipv6Regex);break;default:console.log("applyIPVersionRegex: Unexpected value")}}function autoSelectOptions(){$(".autoSelected").each(function(){null==$(this).val()?$(this).val($(this).find("option").not("[disabled]").first().val()):"enabled"!=currentServerConfig[$(this).val()]&&($(this).find("option:selected").each(function(){$(this).removeAttr("selected")}),$(this).val($(this).find("option").not("[disabled]").first().val()))}),hasARequirement()}function hasARequirement(){$(".hasARequirement").find("option:selected").each(function(){"yes"==$(this).attr("hasIPVersion")?applyIPVersionRegex($("#IPVersion").show().val()):($("#IPVersion").hide(),applyIPVersionRegex("IPvDefault")),"yes"==$(this).attr("hasreqScheme")?$("#reqScheme").show():$("#reqScheme").hide()})}function isMobile(){return!($(window).width()>"991")}function lgIframeRun(){if(localStorage.SelectedServerID&&""!=localStorage.SelectedServerID){var e=$("#"+localStorage.SelectedServerID).data("svjson").Url;$("#loadingCircle").show(),$("#runButton").prop("disabled",!0),$("#funcCard").show(),$("#funcFrame").attr("src",e+"/looking-glass-controller?"+$("#lg_run_form").serialize())}else console.log("Server secilmemis, modal gosterilecek"),$("#serverSelectModal").modal("toggle");setTimeout(()=>{$("#runButton").prop("disabled",!1)},1200)}function svTableFill(e){$("#pageDescr").hide(),$(".svDescr").show(),$(".serverLocation").html($(e).data("svloc"));var t=$(e).data("svjson");["Description","IPV4Address","IPV6Address","ASN"].forEach(function(e){null!=t[e]&&""!=t[e]?$(".server"+e).html(t[e]):$(".server"+e).html('<font class="text-secondary" style="opacity: 0.5">Unspecified</font>')});var o=[];["ping","tracert","nslookup","curl","whois","mtr"].forEach(function(e){"enabled"==currentServerConfig[e]&&o.push(e)});var s="";for(item2 in o)s=""==s?o[item2]:s+","+o[item2];$(".serverServices").html(s)}function listAllToggleToShow(){if("no"==showAllListStat)$("#serverList").find(".collapse").collapse("show"),showAllListStat="yes",$("#showAllLgList").html("Hide all").removeClass("btn-outline-info").addClass("btn-outline-warning");else{var e=localStorage.SelectedServerID;null!=e&&""!=e?($(".collapse").not($("#"+e).parents()).collapse("hide"),$("#"+e).parents().collapse("show")):$("#serverList").find(".collapse").collapse("hide"),showAllListStat="no",$("#showAllLgList").html("Show all").addClass("btn-outline-info").removeClass("btn-outline-success").removeClass("btn-outline-warning")}}function ListServerSelectDelete(){localStorage.removeItem("SelectedServerID"),svButtonLoadSave()}function svApplyConfig(e){for(confIndex in e)"enabled"==e[confIndex]?($("#lgSVconF"+confIndex).prop("disabled",!1),$("#lgSVconF"+confIndex).removeClass("d-none")):($("#lgSVconF"+confIndex).prop("disabled",!0),$("#lgSVconF"+confIndex).addClass("d-none"));"enabled"!=e.IPv4||"enabled"!=e.IPv6?$("#lgSVconFIPvDefault").prop("disabled",!0).addClass("d-none"):$("#lgSVconFIPvDefault").prop("disabled",!1).removeClass("d-none"),svTableFill($("#"+localStorage.SelectedServerID)),autoSelectOptions()}function svButtonLoadSave(e){null!=e&&""!=e?($(".collapse").not($("#"+e).parents()).collapse("hide"),$("#"+e).parents().collapse("show"),$("#"+e).addClass("list-group-item-info"),$(".serverSelectButton").html('<i class="fas fa-server"></i> '+$("#"+e).data("svname")).addClass("btn-secondary").removeClass("btn-danger"),svApplyConfig(currentServerConfig=$("#"+e).data("svconf"))):($("#serverList").find(".collapse").collapse("hide").find(".lgserver").removeClass("list-group-item-info"),$(".serverSelectButton").html("Please Select Server").addClass("btn-danger").removeClass("btn-secondary"))}function svButtonTrigger(){$(function(){$(".server-list-group-item").on("click",function(){$(".collapse").not($(this).parents("")).collapse("hide"),"yes"==showAllListStat&&$("#showAllLgList").html("Show current").addClass("btn-outline-success").removeClass("btn-outline-warning")})}),$(function(){$(".lgserver").on("click",function(){"yes"==showAllListStat&&($(".collapse").not($(this).parents("")).collapse("hide"),$("#showAllLgList").html("Show all").addClass("btn-outline-info").removeClass("btn-outline-success").removeClass("btn-outline-warning"),showAllListStat="no"),$(".lgserver").removeClass("list-group-item-info"),localStorage.setItem("SelectedServerID",$(this).attr("id")),svApplyConfig(currentServerConfig=$(this).data("svconf")),$(this).toggleClass("list-group-item-info").toggleClass(""),svButtonLoadSave(localStorage.SelectedServerID)})})}function svConfigComparisor(e,t){var o={...e},s={...t};for(confIndex in e)"object"==typeof e[confIndex]&&"object"==typeof s[confIndex]?o[confIndex]=svConfigComparisor(e[confIndex],s[confIndex]):t[confIndex]&&(o[confIndex]=s[confIndex]);return o}function arrToDashString(e){var t="";for(item in e)t=""==t?e[item]:t+"-"+e[item];return t}function arrToDotString(e){var t="";for(item in e)t=""==t?e[item]:t+"."+e[item];return t}function lgServerListLoad(e,t,o){if(null!=o&&"object"==typeof o)if(o.length>6)console.log("You are reach maximum depth of server list. Please keep list depth at maximum 5.");else for(index in e){var s=index;if(e[index].ServerConfig)var n=svConfigComparisor(t,e[index].ServerConfig);else n=t;if(void 0===e[index].Name&&""!=e[index].Name)var a=index;else a=e[index].Name;if(void 0===e[index].Description)var r="";else r=e[index].Description;if(e[index].JsonURL)console.log("Currently Nested Json List is not Supported");else if("object"==typeof e[index].Servers){(l=Object.assign([],o)).push(s),$("#"+arrToDashString(o)).append('<button href="#'+arrToDashString(l)+'" class="server-list-group-item list-group-item list-group-item-action btn btn-dark" data-toggle="collapse"><i class="fas fa-list text-dark"></i> '+a+'<small class="text-muted float-right">'+r+'</small></button><div class="list-group collapse" id="'+arrToDashString(l)+'"> '),lgServerListLoad(e[index].Servers,n,l),$("#"+arrToDashString(o)).append("</div>")}else if(e[index].Url){var l;(l=Object.assign([],o)).push(s);var i="",d="";e[index].ASN&&(i=i+'\t&nbsp; <span class="badge badge-light">'+e[index].ASN+"</span> "),"enabled"==n.IPv4||"enabled"==n.IPv6?"enabled"==n.IPv4&&"enabled"==n.IPv6?i+='<font class="server-list-feature-icons text-success" data-toggle="tooltip" data-placement="top" title="IPv4 and IPv6 Connection">DS</font>':"enabled"==n.IPv4?i+='<font class="server-list-feature-icons text-muted" data-toggle="tooltip" data-placement="top" title="IPv4 OnlyConnection">IPv4</font>':i+='<font class="server-list-feature-icons text-warning" data-toggle="tooltip" data-placement="top" title="IPv6 Only Connection">IPv6</font>':d="disabled","enabled"==n.tracert&&(i+='<i class="fas fa-road server-list-feature-icons text-muted" data-toggle="tooltip" data-placement="top" title="TraceRoute"></i>'),$("#"+arrToDashString(o)).append('<button class="server-list-group-item list-group-item list-group-item-action btn btn-light lgserver"'+d+" data-svjson='"+JSON.stringify(e[index])+"' data-svName='"+a+"' data-svloc='"+arrToDotString(l).replace("serverList.","")+"' data-svconf='"+JSON.stringify(n)+"' id=\""+arrToDashString(l)+'"><i class="fas fa-server text-primary"></i>'+a+i+'<small class="text-muted float-right">'+r+"</small></button>")}else console.log("Error: "+arrToDashString(o)+" "+index+" is unknown type of server.")}else console.log("Depth is not array")}function lgServerListLoadAjax(e,t){$.ajax({url:e,dataType:"json",success:function(e){localStorage.setItem("server_js",JSON.stringify(e)),lgServerListLoad(e.Servers,svConfigComparisor(default_server_config.ServerConfig,e.ServerConfig),["serverList"]),svButtonTrigger(),svButtonLoadSave(localStorage.SelectedServerID),$(function(){$('[data-toggle="tooltip"]').tooltip()})},error:function(e){$(".server-list-group").html(JSON.stringify(e)),$(".serverSelectButton").html("ERR,Click more info"),200==e.status?(console.log("ERROR: ","Json Parse Error"),$("#serverSelectLabel").html("Json Parse Error")):404==e.status?(console.log("ERROR: ","Json not found"),$("#serverSelectLabel").html("Json not found in "+server_json_url)):($("#serverSelectLabel").html("Unknown error, for more details please look Developer Console 'F12' "),console.log("Unknown error, here is more details: ",e))}})}$(document).ready(function(){isMobile()&&$("#isMobile").val("1"),$(".hasARequirement").change(function(){hasARequirement()}).change(),$("#IPVersion").change(function(){applyIPVersionRegex($(this).val())}).change(),$("#funcFrame").on("load",function(){$("#loadingCircle").hide()})}),ipv6Regex="^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$",ipv4Regex="^(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\\.|$)){4})",domainRegex="^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z]$",portRegex="^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([1-9][0-9]{3})|([1-9][0-9]{2})|([1-9][0-9])|([1-9]))$",showAllListStat="no","undefined"!=typeof Storage?lgServerListLoadAjax(server_json_url,0):($(".serverSelectButton").prop("disabled",!0),$(".serverSelectButton").html("Sorry! No Web Storage support."));