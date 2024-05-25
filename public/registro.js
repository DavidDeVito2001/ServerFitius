//Agarramos el elemento id = register-form, sumamos un elemento submit porque es a todo el form.
//Hago una función flecha y le paso el paramentro "e" el cual es el evento de todo esto.
document.getElementById('register-form').addEventListener('submit',async(e)=>{  
    e.preventDefault(); 
    const respuesta = await fetch('http://localhost:3000/api/registro',{
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            correo : e.target.children.correo.value,
            password : e.target.children.password.value
        })
    });
});