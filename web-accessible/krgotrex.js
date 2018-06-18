
function init() {

    console.log("Initialization!");

    var mymap = L.map('mapid').setView([51.505, -0.09], 13);

    $('#suggest').on('click', function(e) {
    var site = $("#newsite").val();
        var desc = $("#whereis").val();
        console.log(site, desc);
    });

};
