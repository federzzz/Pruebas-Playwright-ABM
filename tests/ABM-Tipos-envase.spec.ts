import { test, expect } from '@playwright/test';


test('test', async ({page}) => {
    test.setTimeout(90000)

    await page.goto('http://localhost/ssgWebBZ/ssgBZ001/TipoEnvase');

    await page.getByPlaceholder('Usuario').fill('administrador');
    await page.getByPlaceholder('Usuario').press('Tab');
    await page.getByPlaceholder('Contraseña').fill('rjs2528');
    await page.getByPlaceholder('Contraseña').press('Enter');
  
    // Verificar que la URL cambie
    await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/TipoEnvase');
  
    console.log('Inicio de sesión exitoso');

    await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice

    const navTipoEnv = page.locator('nav:has-text("Tipos de envase"):visible')

    //hacemos funcion para obtener total de registros mostrados en la pantalla
async function obtenerRegistros(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica
  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Tipos de envase"):visible ~ div:has-text("item(s)")');

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
  
    const grab = page.locator('button[title="Grabar"]')
    await grab.click()
    
    const validacod = page.getByRole('heading', {name:'Tipo de envases'})
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar código')
  
    await page.waitForTimeout(2000)
    const btnacep = page.getByRole('button', {name:'Aceptar'})
    await btnacep.click()

    const cod = page.locator('label:has-text("Código:") + div input'); //localizo el label, luego selecciona el div que está justo después del label y luego selecciona el input que esta en ese div
    await cod.fill(codigonuevo)
    await grab.click()//intentamos grabar para que salte validación
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar descripción')
    await page.waitForTimeout(2000)

    await btnacep.click()

    const descrip = page.locator('label:has-text("Descripción:") + div input')
    const descripfija = 'Bolson FZ'
    await descrip.fill(descripfija)
    await grab.click()//intentamos grabar para que salte validación
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar capacidad')
    await page.waitForTimeout(2000)

    await btnacep.click()

    const capacidad = page.locator('input#txtCotizadorCuerpoValor').nth(0)
    await capacidad.fill('1,00')
    await grab.click()//intentamos grabar para que salte validación
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar peso del envase')
    await page.waitForTimeout(2000)

    await btnacep.click()

    const pesoenv = page.locator('input#txtCotizadorCuerpoValor').nth(1)
    await pesoenv.fill('0,01')
    await grab.click()//intentamos grabar para que salte validación
    expect(validacod).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar unidad de medida')
    await page.waitForTimeout(2000)

    await btnacep.click()

    const unidadmed = page.getByRole('combobox', {name:'Unidad de medida:'})
    await unidadmed.selectOption('KGS')
    await grab.click()
    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
    
    const NumeroActualizado = await obtenerRegistros(page)
    console.log('Ahora el total de registros es de: ',NumeroActualizado)
    expect(NumeroActualizado).toBe(numeroInicial+1)

    
    //Modificacion


    const modif = navTipoEnv.getByTitle('Modificar')
    await modif.click()
    const nuevadescrip = 'ENVASE FZ MODIFICADO'
    const nuevacap = '5,00'
    await descrip.fill(nuevadescrip)
    await capacidad.fill(nuevacap)
    await grab.click()
    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
    await modif.click()
    const descripmodificada = await descrip.inputValue()
    const capacidadmodificada = await capacidad.inputValue()
    
    console.log('La descripción fue modificada correctamente a: ',descripmodificada)
    console.log('La capacidad fue modificada correctamente a: ',capacidadmodificada)
    expect(descripmodificada).toBe(nuevadescrip)
    expect(capacidadmodificada).toBe(nuevacap)
    
    const cancelar = page.locator('button[title="Cancelar"]')
    await cancelar.click()
    
    //Eliminación de registro
    const eliminar = navTipoEnv.getByTitle('Eliminar')
    await eliminar.click()
    const validacod2 = page.getByRole('heading', {name:'Tipos de envase'})

    expect(validacod2).toBeVisible()
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