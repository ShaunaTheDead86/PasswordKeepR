const reloadListeners = function() {
  loadDynamicListeners();
}

// functions to run on document ready
$(document).ready(function() {
  loadStaticListeners();
  reloadListeners();
});
