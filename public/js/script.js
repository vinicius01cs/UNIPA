function displayFileName() {
    const input = document.getElementById('inputPlanilha');
    const label = document.getElementById('labelPlanilha');
    if (input.files && input.files.length > 0) {
        label.textContent = input.files[0].name;
    } else {
        label.textContent = 'Selecione a planilha:';
    }
}