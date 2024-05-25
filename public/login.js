document.getElementById('register-form').addEventListener('submit',async(e)=>{  
    e.preventDefault(); 
    const respuesta = await fetch('http://localhost:3000/api/login',{
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