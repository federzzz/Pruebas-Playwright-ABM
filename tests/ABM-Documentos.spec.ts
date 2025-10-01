import { test, expect } from '@playwright/test';


test('test', async ({page}) => {
    test.setTimeout(90000)

    await page.goto('http://localhost/ssgWebBZ/ssgBZ001/Documento');

    await page.getByPlaceholder('Usuario').fill('administrador');
    await page.getByPlaceholder('Usuario').press('Tab');
    await page.getByPlaceholder('Contraseña').fill('rjs2528');
    await page.getByPlaceholder('Contraseña').press('Enter');
  
    // Verificar que la URL cambie
    await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/Documento');
  
    console.log('Inicio de sesión exitoso');

    await page.waitForTimeout(1000); // Espera 1 segundos para que la página se actualice
    const navDoc = page.locator('nav:has-text("Documentos"):visible')
  

    //hacemos funcion para obtener total de registros mostrados en la pantalla
async function obtenerRegistros(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica
  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Documentos"):visible ~ div:has-text("item(s)")');

  await expect(contadorElement).toBeVisible({ timeout: timeout }); 
  const contenido = await contadorElement.textContent();
  const match = contenido.trim().match(/\d+/);
  
  const numero = match ? parseInt(match[0], 10) : 0;
  return numero;
}
      
    const numeroInicial = await obtenerRegistros(page);
    console.log('Número actual de registros:', numeroInicial); // Imprimir para verificar  

    const descripnueva = 'Documento 1'
  
    const agregar = await page.getByRole('button', { name: '+' })
    await agregar.click();
  
    const grab = page.locator('button[title="Grabar"]')
    await grab.click()
    
    const valida = page.getByRole('heading', {name:'Documento'})
    expect(valida).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar descripción')
  
    await page.waitForTimeout(2000)
    const btnacep = page.getByRole('button', {name:'Aceptar'})
    await btnacep.click()
    
    const descrip = page.getByRole('textbox',{name:'Descripción:'})
    await descrip.fill(descripnueva)

    await grab.click()//intentamos grabar para que salte validación

    expect(valida).toBeVisible()
    console.log('Se verifica correctamente validación de ingresar archivo')
    await page.waitForTimeout(2000)
    await btnacep.click()

    //seleccion de archivo
 
    const archivo = page.locator('label[title="Examinar"] + label + input[type="file"]'); //busca el input de tipo archivo que esta despues del label de examinar y de descargar
    
    // Ruta absoluta del archivo a subir

    await archivo.setInputFiles('C:\\Users\\FZanin\\Downloads\\imagen.png'); //RUTA DE LA IMAGEN
    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
    

    const inputTexto = page.locator('input[placeholder="Ningún archivo seleccionado..."]')

    const cargado = await inputTexto.inputValue()
    console.log(cargado)
    expect(cargado).toBe("imagen.png"); //NOMBRE DE LA IMAGEN COMPLETO


    await grab.click()
    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
    
    const NumeroActualizado = await obtenerRegistros(page)
    console.log('Ahora el total de registros es de: ',NumeroActualizado)
    expect(NumeroActualizado).toBe(numeroInicial+1)

    
    //Modificacion

    const modif = navDoc.getByTitle('Modificar')
    await modif.click()
    const nuevadescrip = 'Documento modificado'
    await descrip.fill(nuevadescrip)
    await grab.click()
    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice
    await modif.click()
    const descripmodificada = await descrip.inputValue()

    console.log('La descripción fue modificada correctamente a: ',descripmodificada)
    console.log('Se guardó correctamente la imagen: ',cargado)
    expect(descripmodificada).toBe(nuevadescrip)
    expect(cargado).toBe("imagen.png"); //NOMBRE DE LA IMAGEN COMPLETO
    
    
    const cancelar = page.locator('button[title="Cancelar"]').nth(0)
    await cancelar.click()
    
    //Eliminación de registro
    const eliminar = navDoc.getByTitle('Eliminar')
    await eliminar.click()

    const validaElim = page.getByRole('heading', {name:'Documentos'})
    expect(validaElim).toBeVisible()
    console.log('Se verifica correctamente validación de eliminar registro')
  
    await page.waitForTimeout(2000)
    const btnsi = page.getByRole('button', {name:'Si'})
    await btnsi.click()
    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

    const numeroFinalconeliminado = await obtenerRegistros(page)
    console.log('La cantidad de registros es de: ',numeroFinalconeliminado)
    expect(numeroFinalconeliminado).toBe(NumeroActualizado-1)

    await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

}
)