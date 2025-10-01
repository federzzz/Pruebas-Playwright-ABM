import { test, expect } from '@playwright/test';


test('test', async ({page}) => {
    test.setTimeout(90000)

    await page.goto('http://localhost/ssgWebBZ/ssgBZ001/ListaPrecio');

    await page.getByPlaceholder('Usuario').fill('administrador');
    await page.getByPlaceholder('Usuario').press('Tab');
    await page.getByPlaceholder('Contraseña').fill('rjs2528');
    await page.getByPlaceholder('Contraseña').press('Enter');
  
    // Verificar que la URL cambie
    await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/ListaPrecio');
  
    console.log('Inicio de sesión exitoso');

    // actualizar pantalla
    const navListaprecio = page.locator('nav:has-text("Lista de Precios"):visible')
    const btnactualizar = navListaprecio.getByTitle('Actualizar')
    await btnactualizar.click()
    await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice

    //hacemos funcion para obtener total de registros mostrados en la pantalla
async function obtenerRegistros(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica
  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Lista de Precios"):visible ~ div:has-text("item(s)")');

  await expect(contadorElement).toBeVisible({ timeout: timeout }); 
  const contenido = await contadorElement.textContent();
  const match = contenido.trim().match(/\d+/);
  
  const numero = match ? parseInt(match[0], 10) : 0;
  return numero;
}
      
    const numeroInicial = await obtenerRegistros(page);
    console.log('Número actual de registros:', numeroInicial); // Imprimir para verificar  


    const codigonuevo = 'FZ99'
  
    const agregar = await page.getByRole('button', { name: '+' })
    await agregar.click();
  
    const cod = page.getByRole('textbox', {name:'Código:'})
    const lista = page.getByRole('textbox', {name:'Lista:'})
    
    const grab = page.locator('button[title="Grabar"]')
    await grab.click()
    
    const validacod = page.locator('h5.modal-title.text-white')
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar código')
  
    await page.waitForTimeout(3000)
    const btnacep = page.getByRole('button', {name:'Aceptar'})
    await btnacep.click()

    await cod.fill(codigonuevo)
    await grab.click()
    expect(validacod).toBeVisible() //arroja validación de que debe ingresar una descripción
    console.log('Se verifica correctamente validación de ingresar descripción')
    await page.waitForTimeout(3000)
    await btnacep.click()
    
    const nombrelista = "Lista prueba automatizada"
    await lista.fill(nombrelista)  
    const checkventa = page.getByRole('checkbox',{name:'Actualiza el precio de costo al cambiar el precio de venta'})
    await checkventa.check()

    await grab.click()
    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
    
    const numeroFinal = await obtenerRegistros(page);
    console.log('Número actual de registros:', numeroFinal); // Imprimir para verificar  
    expect(numeroFinal).toBe(numeroInicial+1) //verificamos actualización de registros
    console.log('Se grabó exitosamente el registro'); 

    //Modificación
    const modi = navListaprecio.getByTitle('Modificar')
    await modi.click()
    const planta = page.getByRole('combobox', {name:'Planta:'})

    const nuevonombre = 'Modificacion'
    const nuevasuc = 'PB'

    await lista.fill(nuevonombre)
    await planta.selectOption(nuevasuc)
    //desactivamos el check
    await checkventa.uncheck()
    await grab.click()
    await page.waitForTimeout(2000); // Espera 4 segundos para que la página se actualice

    await modi.click()
    //guardamos los valores de descrip y desc rec
  
    const valorlista = await lista.inputValue();
    const valorplanta = await planta.inputValue();


    expect(valorlista).toBe(nuevonombre)
    expect(valorplanta).toBe(nuevasuc)
    expect(checkventa).not.toBeChecked() //verificar que el checkbox fue desactivado
    console.log('Se modificó el registro exitosamente')

    const cancelar = page.locator('button[title="Cancelar"]').nth(0)
    await cancelar.click()

    const eliminar = navListaprecio.getByTitle('Eliminar')
    await eliminar.click()

    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de eliminar item')
    await page.waitForTimeout(2000)
    const btnsi = page.getByRole('button', {name:'Si'})
    await btnsi.click()
    
    await page.waitForTimeout(2000) //esperamos que se actualice el registro

    const numeroFinalconeliminado = await obtenerRegistros(page);
    console.log('Número actual de registros:', numeroFinalconeliminado); // Imprimir para verificar  

    expect(numeroFinalconeliminado).toBe(numeroFinal-1) //verificamos que se eliminó
    console.log('Se eliminó exitosamente el registro'); 
    await page.waitForTimeout(2000); // Espera 4 segundos para que la página se actualice

/*
    //filtramos por lista insumos
    const filtro = page.locator('button[title="Filtros"]').nth(1)
    await filtro.click()

    const listaabuscar = 'ins'
    const busq = page.getByRole('textbox', {name:'Búsqueda:'})
    await busq.fill(listaabuscar)                    //LISTA A SEGUIR FILTRADA

    const btnfiltrar = page.getByRole('button', {name:'Filtrar'})
    await btnfiltrar.click()

    //prueba de asistente de agregación de artículos
    const btnAsist = page.locator('button[title="Asistente para listas de precios"]')
    await btnAsist.click()

    const btnSig = page.locator('button[title="Siguiente"]')
    await btnSig.click()

    const centroabuscar = 'coad'
    const centroop = page.getByRole('textbox', {name:'Centro Operativo:'})
    await centroop.fill(centroabuscar)
    
    const btnbusqueda = page.locator('button#cmdBuscar')
    await btnbusqueda.click()

    const provabuscar = '09109'
    const comboprov = page.getByRole('combobox', {name:'Proveedor:'})
    await comboprov.selectOption(provabuscar)

    await page.waitForTimeout(4000); // Espera 4 segundos para que la página se actualice

*/
}
)