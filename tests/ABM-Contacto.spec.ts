import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(180000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/ssgBZ001/ClienteContacto');

  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  await page.getByPlaceholder('Contraseña').press('Enter');

  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/ClienteContacto');
  
  console.log('Inicio de sesión exitoso');

  await page.waitForTimeout(1500); // Espera 1,5 segundos para que la página se actualice
    
  // actualizar pantalla
  const navContactos = page.locator('nav:has-text("Contactos"):visible')
  const btnactualizar = navContactos.getByTitle('Actualizar')
  //const btnactualizar = page.locator('button[title="Actualizar"]')
  await btnactualizar.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  //hacemos funcion para obtener total de registros mostrados en la pantalla
async function obtenerRegistros(page, options = {}) {
  const { timeout = 5000 } = options; // Usamos 5s por defecto si no se especifica
  // 1. Encuentra una <nav> que contenga el texto "Facturas (Ventas)".
  // 2. A partir de ahí (~), busca un 'hermano' <div> que venga DESPUÉS en el código.
  // 3. Ese <div> debe contener el texto "item(s)".
  const contadorElement = page.locator('nav:has-text("Contactos"):visible ~ div:has-text("item(s)")');

  await expect(contadorElement).toBeVisible({ timeout: timeout }); 
  const contenido = await contadorElement.textContent();
  const match = contenido.trim().match(/\d+/);
  
  const numero = match ? parseInt(match[0], 10) : 0;
  return numero;
}
  
  const numeroInicial = await obtenerRegistros(page);
  console.log('Número actual de registros:', numeroInicial); // Imprimir para verificar

  const agregar = page.getByRole('button', { name: '+' })
  await agregar.click();

  const clientefijo = '02175'
  const client = page.getByRole('textbox', {name:'Cliente:'})
  await client.fill(clientefijo)

  const btnbusc = page.locator('button#cmdBuscar').nth(1)
  await btnbusc.click()

  const grab = page.locator('button[title="Grabar"]').nth(3)
  await grab.click()

  const validanomb = page.getByRole('heading', {name:'Contacto'})
  expect(validanomb).toBeVisible()
  await page.waitForTimeout(2000); // Espera 2 segundos

  console.log('Se verifica correctamente validación de digitar un valor para Nombre')
  const btnacep = page.getByRole('button', {name:'Aceptar'})
  await btnacep.click()

  const btnlimpiar = page.locator('.ssg-input-md .input-group button#cmdLimpiar').nth(0)
  await btnlimpiar.click()

  const descripcon = 'Prueba automatizada'
  const contacto = page.getByRole('textbox', {name:'Contacto:'})
  await contacto.fill(descripcon)

  const descripcargo = 'Automatizador'
  const cargo = page.locator('.ssg-input-md .input-group input.form-control').nth(0)
  await cargo.fill(descripcargo)

  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice


  await grab.click()
  
  const validacli = page.getByRole('heading', {name:'Contacto'})
  expect(validacli).toBeVisible()
  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

  console.log('Se verifica correctamente validación de digitar un valor para cliente')

  
  await btnacep.click()

  await client.fill(clientefijo)

  await btnbusc.click()
  
  await page.waitForTimeout(1000) //esperamos 1 seg a que se cargue

  const direcc = page.locator('.ssgTabContent.container-abm div.ssg-input textarea.form-control-sm.textarea').nth(0)
  await direcc.fill('Jujuy 1630')

  const locali = page.getByRole('textbox', {name:'Localidad:'}).nth(0)
  await locali.fill('5900-00')
  
  const btnbusc2 = page.locator('button#cmdBuscar').nth(2)
  await btnbusc2.click()


  const directrabajo = page.locator('.ssgTabContent.container-abm div.ssg-input textarea.form-control-sm.textarea').nth(1)
  await directrabajo.fill('Jose ingenieos 550')

  const locali2 = page.getByRole('textbox', {name:'Localidad:'}).nth(1)
  await locali2.fill('2550-00') //bell
  const btnbusc3 = page.locator('button#cmdBuscar').nth(3)
  await btnbusc3.click()

  const tel = page.getByRole('textbox', {name:'Teléfono:'})
  await tel.fill('3534765486')

  const fax = page.getByRole('textbox', {name:'Fax:'})
  await fax.fill('03534610477')

  const telm = page.getByRole('textbox', {name:'Teléfono móvil:'})
  await telm.fill('03534765489')

  const corr = page.getByRole('textbox', {name:'Correo electrónico:'})
  await corr.fill('fede_o_z@hotmail.com')

  const corr2 = page.getByRole('textbox', {name:'Correo electrónico 2:'})
  await corr2.fill('fede.oscar.z@gmail.com')

  const corr3 = page.getByRole('textbox', {name:'Correo electrónico 3:'})
  await corr3.fill('fzanin@advisers.com.ar')

  const obs1 = page.locator('.ssgTabContent.container-abm div.row.mb-1 div.col textarea.form-control.form-control-sm.textarea')
  await obs1.fill('Esta es una observacion')

  const fechanac = page.getByRole('textbox', {name:'Fecha de nacimiento:'})
  await fechanac.fill('20 2 96')

  const fechaani = page.getByRole('textbox', {name:'Fecha de aniversario:'})
  await fechaani.fill('20 2 26')

  await grab.click()
  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

  const numerofinal = await obtenerRegistros(page)
  console.log('Registros actuales:', numerofinal)

  expect(numerofinal).toBe(numeroInicial+1)
  //Modificacion

  const btnmod = page.locator('button[title="Modificar"]').nth(2)
  await btnmod.click()

  const descripconmod = 'Prueba Automatizada Modificada'
  await contacto.fill(descripconmod)

  const descripcargomod = 'Desarrollador'
  await cargo.fill(descripcargomod)

  const direcparmod = 'Mendoza 2500'
  await direcc.fill(direcparmod) 

  await grab.click()
  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

  //volvemos a ingresar al registro para verificar los campos modificados
  await btnmod.click()

  const nombremod = await contacto.inputValue()
  const cargomod = await cargo.inputValue()
  const direcmod = await direcc.inputValue()

  expect(nombremod).toBe(descripconmod)
  console.log('Se modificó el nombre exitosamente a:',nombremod)
  expect(cargomod).toBe(descripcargomod)
  console.log('Se modificó el nombre exitosamente a:',cargomod)
  expect(direcmod).toBe(direcparmod)
  console.log('Se modificó el nombre exitosamente a:',direcmod)
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice


  const canc = page.locator('button[title="Cancelar"]').nth(3)
  await canc.click() //salimos del registro para volver a la pantalla principal

  const elim = navContactos.getByTitle('Eliminar')
  await elim.click()

  const validaElim = page.getByRole('heading', {name:'Contactos'})
  expect(validaElim).toBeVisible()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  console.log('Se verifica correctamente validación de si esta seguro borrar el item seleccionado')
  const btnsi = page.getByRole('button', {name:'Si'})
  await btnsi.click()
  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice

  const Registrosactualizados = await obtenerRegistros(page)
  
  console.log('Registros actuales luego de eliminar el registro:', Registrosactualizados)

  expect(Registrosactualizados).toBe(numerofinal-1)  

  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

})