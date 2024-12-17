var visible = false; 
        function iniciar() { 
            var elemento = document.getElementById("menu-img"); 
            elemento.addEventListener("click", mostrarMenu); 
        } 
        function mostrarMenu() { 
            var elemento = document.getElementsByClassName("navigation")[0]; 
            if (!visible) { 
                elemento.style.display = "block"; 
                visible = true; 
            } else { 
                elemento.style.display = "none"; 
                visible = false; 
            } 
        } 
        window.addEventListener("load", iniciar); 