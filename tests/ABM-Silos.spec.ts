import { test, expect } from '@playwright/test';


test('test', async ({page}) => {
    test.setTimeout(90000)

    await page.goto('http://localhost/ssgWebBZ/ssgBZ001/Silo');

    await page.getByPlaceholder('Usuario').fill('administrador');
    await page.getByPlaceholder('Usuario').press('Tab');
    await page.getByPlaceholder('Contraseña').fill('rjs2528');
    await page.getByPlaceholder('Contraseña').press('Enter');
  
    // Verificar que la URL cambie
    await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/Silo');
  
    console.log('Inicio de sesión exitoso');

    await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice

    //hacemos funcion para obtener total de registros mostrados en la pantalla
async function obtenerRegistros(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica
  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Silos"):visible ~ div:has-text("item(s)")');

  await expect(contadorElement).toBeVisible({ timeout: timeout }); 
  const contenido = await contadorElement.textContent();
  const match = contenido.trim().match(/\d+/);
  
  const numero = match ? parseInt(match[0], 10) : 0;
  return numero;
}
    
    // Paso 1: Localizamos la barra de navegación que contiene el texto "Silos".
    // Esto nos da un punto de partida único en la página.
    const navBarSilos = page.locator('nav:has-text("Silos")');

    // Paso 2: Dentro de esa barra de navegación, buscamos el botón por su título "Actualizar".
    const botonActualizar = navBarSilos.getByTitle('Actualizar');

    // Ahora podés hacer clic de forma segura y sin ambigüedad.
    await botonActualizar.click();
    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice



    const numeroInicial = await obtenerRegistros(page);
    console.log('Número actual de registros:', numeroInicial); // Imprimir para verificar  

    const codigonuevo = 'FZ99'
  
    const agregar = await page.getByRole('button', { name: '+' })
    await agregar.click();
  
    //const grab = page.locator('button[title="Grabar"]').first()
    const contenedorGrab = page.locator('nav:has-text("Insertar silo")')
    const grab = contenedorGrab.getByTitle('Grabar')
    await grab.click()
    
    const validacod = page.getByRole('heading', {name:'Silo'})
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar código')
  
    await page.waitForTimeout(3000)
    const btnacep = page.getByRole('button', {name:'Aceptar'})
    await btnacep.click()

    const cod = page.locator('label:has-text("Código:") + div input'); //localizo el label, luego selecciona el div que está justo después del label y luego selecciona el input que esta en ese div
    await cod.fill(codigonuevo)
    await grab.click()//intentamos grabar para que salte validación
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar descripción')
    await btnacep.click()

    const descrip = page.locator('label:has-text("Descripción:") + div input')
    const descripfija = 'SILO GRANO FZ'
    await descrip.fill(descripfija)
    await grab.click()//intentamos grabar para que salte validación
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar grano')
    await btnacep.click()

    //const selectgrano = page.locator('select#cboGrano')
    const selectgrano = page.getByRole('combobox',{name:'Grano:'})
    await selectgrano.selectOption('SJ')

    await grab.click()//intentamos grabar para que salte validación
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar capacidad')
    await btnacep.click()

    //const capacidad = page.locator('input#txtCapacidad')
    const capacidad = page.getByRole('textbox', {name:'Capacidad:'})
    await capacidad.fill('1000000')
    //const existencia = page.locator('input#txtExistencia')
    const existencia = page.getByRole('textbox', {name:'Existencia:'})
    await existencia.fill('100000')
    await grab.click()//lo registramos y queda en la pantalla principal con el registro nuevo seleccionado
    await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

    const NumeroActualizado = await obtenerRegistros(page)
    console.log('Ahora el total de registros es de: ',NumeroActualizado)
    expect(NumeroActualizado).toBe(numeroInicial+1)

    //Modificacion

    //const modif = page.locator('button[title="Modificar"]')
    const modif = navBarSilos.getByTitle("Modificar")
    await modif.click()
    const nuevadescrip = 'SILO FZ MODIFICADO'
    const nuevacap = '1.500.000'
    await descrip.fill(nuevadescrip)
    await capacidad.fill(nuevacap)

    const contenedorGrab2 = page.locator('nav:has-text("Modificar silo")')
    const grab2 = contenedorGrab2.getByTitle('Grabar')
    await grab2.click()  

    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
    await modif.click()
    const descripmodificada = await descrip.inputValue()
    const capacidadmodificada = await capacidad.inputValue()
    
    console.log('La descripción fue modificada correctamente a: ',descripmodificada)
    console.log('La capacidad fue modificada correctamente a: ',capacidadmodificada)
    expect(descripmodificada).toBe(nuevadescrip)
    expect(capacidadmodificada).toBe(nuevacap)
    
    const cancelar = contenedorGrab2.getByTitle("Cancelar")
    await cancelar.click()

    //Eliminación de registro
    const eliminar = navBarSilos.getByTitle("Eliminar")
    await eliminar.click()
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de eliminar registro')
    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

    const btnsi = page.getByRole('button', {name:'Si'})
    await btnsi.click()

    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
    
    const numeroFinalconeliminado = await obtenerRegistros(page)
    console.log('La cantidad de registros es de: ',numeroFinalconeliminado)
    expect(numeroFinalconeliminado).toBe(NumeroActualizado-1)

    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

}
)