function showTool(id) {
  document.querySelectorAll('.tool-section').forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}
