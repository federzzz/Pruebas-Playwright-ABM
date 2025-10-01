import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(180000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/ssgBZ001/Cliente');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  await page.getByPlaceholder('Contraseña').press('Enter');

  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/Cliente');

  
  console.log('Inicio de sesión exitoso');
  

  const agregar = await page.getByRole('button', { name: '+' })
  await agregar.click();

  await page.waitForTimeout(2000); // Espera 1 segundos para que la página se actualice

  const formInsertarCliente = page.locator('form:has-text("Insertar cliente"):visible')
  const codcli = await page.getByRole('textbox', {name:'Cuenta:'}).inputValue();

  //verificamos validacion de que tiene que poner nombre de cliente

  const guardar = await page.locator('button.btn.btn-success[title="Grabar"]').nth(15)
  await guardar.click()


  const valid1 = await page.getByRole('heading', { name: 'Cliente'})
  
  expect(valid1).toBeVisible
  console.log('Se verifica validación de ingresar nombre a cliente')
  await page.waitForTimeout(2000); //esperamos 2 seg
  
  
  //const aceptar = await page.getByRole('button', {name:'Aceptar'}).click()
  const btnaceptar = await page.getByRole('button', {name:'Aceptar'})
  await btnaceptar.click()

  //const nrodoc = await page.locator('input#txtClienteCUIT') //REFACTORIZAR
  const nrodoc = formInsertarCliente.getByLabel('Nro. de documento:').first();
  await nrodoc.fill('20-11111111-2')

  //nombre
  const nombreEsperado = 'PRUEBA AUTOMATIZACION';
  const nombre = await page.getByRole('textbox', { name: 'Nombre:'})
  await nombre.fill(nombreEsperado)

  const nombrefan = await page.getByRole('textbox', { name: 'Nombre de fantasía:'})
  await nombrefan.fill('PRUEBA FANTASIA')

  //guardar cliente
  await guardar.click()

  //validacion de Debe ingresar el domicilio del cliente.
  expect(valid1).toBeVisible
  console.log('Se verifica validación de ingresar el domicilio')
  await page.waitForTimeout(2000); //esperamos 2 seg


  await btnaceptar.click()


  const tipocuenta = page.getByRole('combobox', {name:'Tipo de cuenta:'});
  //await tipocuenta.waitFor({ state: 'visible' });
  

  //seleccionar opción cliente
  //await tipocuenta.selectOption('COR');

  const tipointext = page.getByRole('combobox', {name:'Interna/Externa:'});

  //seleccionar opción cliente
  await tipointext.selectOption('cNinguna'); 


  //ingresar domicilio
  //const domicilio = page.getByRole('textbox', {name:'Dirección'})
  const domicilio = formInsertarCliente.getByRole('textbox',{name:'Dirección:'}).first()
  await domicilio.fill('Jose ingenieros')
  const numerodir = page.getByRole('textbox', {name:'Número:'})
  await numerodir.fill('550')


  //opcion urbano o rural
  const urbanorur = page.getByRole('combobox', {name:'Tipo:'});

  //seleccionar opción cliente
  await urbanorur.selectOption('cUrbano'); 

  //filtro de localidad 
  const localidad = page.getByRole('textbox', {name:'Localidad:'});
  await localidad.fill('5900-00')

  const btnbuscarloc = page.locator('button#cmdBuscar.btn.btn-sm.btn-outline-dark[data-toggle="tooltip"][title="Buscar"]').nth(10)
  await btnbuscarloc.click()

  //opcion Zona
  const combozona = page.getByRole('combobox', {name:'Zona:'});
  await combozona.selectOption('C1') //X en TestingFZ // C1 en TestGeneral
  //2da direccion
  const direc2 = formInsertarCliente.getByRole('textbox',{name:'Dirección:'}).nth(1)
  await direc2.fill('Jose ingenieros 2')


  const tel = page.getByRole('textbox', {name:'Teléfono:'});
  await tel.fill('3534765427')
  const fax = page.getByRole('textbox', {name:'Fax:'});
  await fax.fill('3534765428')
  //const mail = page.getByRole('textbox', {name:'E-Mail:'}); ESTE ESTA CORRECTO POR LO QUE SE PASA INCID
  const mail = page.getByRole('textbox', {name:'EMail:'});

  await mail.fill('mail@gmail.com')

  const codact = page.getByRole('textbox', {name:'Código de actividad:'});
  await codact.fill('1996')
  const act = page.getByRole('textbox', {name:'Actividad:', exact: true });
  await act.fill('Testing')  


  //Ficha Impuestos
  const imp = page.getByRole('tab', {name:'Impuestos'});
  await imp.click();

  //combo categoria IVA
  //const combocategoria = page.locator('#cboClienteCondicionIVACategoria')
  const combocategoria = formInsertarCliente.getByRole('combobox',{name:'Categoría:'})
  await combocategoria.selectOption('Ambos')

  //ingresos brutos
  //const combobrutos = page.locator('#cboClienteIBProvincia').last()
  const combobrutos = formInsertarCliente.getByRole('combobox',{name:'Provincia:'})

  await combobrutos.selectOption('X')
  //await combobrutos.click();
  //await page.keyboard.type('CORDOBA');
  //await page.keyboard.press('Enter');

  //const combocondicion = page.locator('#cboClienteIBCondicion').nth(1)
  const combocondicion = formInsertarCliente.getByRole('combobox',{name:'Condición IIBB:'})

  await combocondicion.selectOption('cIngBruInscripto')

  //num inscripcion
  //const numinscrip = page.locator('#txtClienteIBNumeroIngBru').nth(1)
  const numinscrip = formInsertarCliente.getByRole('textbox',{name:'Nro. inscripción:',exact: true})
  await numinscrip.fill('904-20122')
  //seleccion de alicuota
  //const aliper = page.locator('#cboClienteIBAlicuotaIngBru1').nth(1)
  //const aliper = formInsertarCliente.getByRole('combobox',{name:'Alícuota percepción:'})

  //await aliper.selectOption('ARBAP3') //PX200 en testingfz
  
  //const aliret = page.locator('#cboClienteIBAlicuotaIngBru2').nth(1)
  //await aliret.selectOption('RTDGR6') //RTDGR6 en testingfz



   //INSERTAR OTRA PROVINCIA ING BRU
  //agregar otras provincias

  const agregarOtrasProv = page.locator('button.btn.btn-outline-dark[data-toggle="tooltip"][title="Insertar"]').nth(9)
  await agregarOtrasProv.click()


 
  //ingresos brutos
  const combobrutos2 = page.locator('#cboClienteIBProvincia').nth(0)
  await combobrutos2.selectOption('B')
  //await combobrutos.click();
  //await page.keyboard.type('CORDOBA');
  //await page.keyboard.press('Enter');
  
  const combocondicion2 = page.locator('#cboClienteIBCondicion').nth(0)
  await combocondicion2.selectOption('cIngBruConvMultil')
  
  //num inscripcion
  const numinscrip2 = page.locator('#txtClienteIBNumeroIngBru').nth(0)
  await numinscrip2.fill('904-20125')
  //seleccion de alicuota
  const aliper2 = page.locator('#cboClienteIBAlicuotaIngBru1').nth(0)
  
  await aliper2.selectOption('PD07')
    
  const aliret2 = page.locator('#cboClienteIBAlicuotaIngBru2').nth(0)
  await aliret2.selectOption('RIB13')

  const btnGrabOtraProv = page.locator('button.btn.btn-success[type="submit"][data-toggle="tooltip"][title="Grabar"]').first()
  await btnGrabOtraProv.click()
  await page.waitForTimeout(1000); //esperamos 1 seg para que grabe ok

  //seleccionar estado sisa
  //const condsisa = page.locator('select#cboClienteCondicionRG1394')
  const condsisa = formInsertarCliente.getByRole('combobox', {name:'S.I.S.A.:'})

  await condsisa.selectOption('cRG1394Suspendido')

  //FICHA CONDICIONES COMERCIALES

  const condcomer = page.getByRole('tab', {name:'Cond. comerciales'})
  await condcomer.click()

  //('input#txtClienteClienteVendedor')
  // carga de vendedor
  const vend = formInsertarCliente.getByLabel('Vendedor');
  await vend.fill('82807') // vendedor en testingfz 
  const btnbuscvend = page.locator('button#cmdBuscar[type="Submit"]').nth(11)
  await btnbuscvend.click()

  //carga de transportista
  //const transp = page.locator('#txtClienteClienteTransportista');
  //await transp.fill('01720') //  01276 en testingfz
  //const btnbusctransp = page.locator('button#cmdBuscar[type="Submit"]').nth(12)
  //await btnbusctransp.click()

  const comcomp = page.locator('input#txtClienteComisionCompra')
  await comcomp.fill('0,15')

  const comvend = page.locator('input#txtClienteComisionVenta')
  await comvend.fill('0,30')

  //const listpre = page.locator('select#cboClienteListaPrecio')
  const listpre = formInsertarCliente.getByRole('combobox', {name:'Lista de precio:'})

  await listpre.selectOption('0001')

  //const listcondpag = page.locator('select#cboClienteCondicionPago')
  const listcondpag = formInsertarCliente.getByRole('combobox', {name:'Cond. de pago:'})

  await listcondpag.selectOption('002')

  //const codgln = page.locator('input#txtClienteCodigoGLN')
  //const codgln = formInsertarCliente.getByRole('input#txtClienteCodigoGLN')
  //await codgln.fill('BBB888CCC')

  //const tipcal = page.locator('select#cboClienteTipoCalculo')
  //await tipcal.selectOption('tcImporteFijo')

  //const tipcalvto = page.locator('select#cboClienteTipoCalculoVto')
  //await tipcalvto.selectOption('Habil')

  //const autorizado = page.locator('input#txtClienteClienteAutorizado')
  //await autorizado.fill('01989')
  //const btnBuscAut = page.locator('button#cmdBuscar.btn.btn-sm.btn-outline-dark[data-toggle="tooltip"][title="Buscar"]').nth(13)
  //await btnBuscAut.click()

  //const tipoTarifa = page.locator('select#cboClienteTipoTarifaComision')
  //await tipoTarifa.selectOption('Porcentaje')

  //const tipoAct = page.locator('select#cboClienteTipoActividad')
  //await tipoAct.selectOption('ProcesadorGrano')

  //FICHA RELACIONES
  const tabRelaciones = page.getByRole('tab', {name: 'Relaciones'})
  await tabRelaciones.click()

  const btnInsertarAsoc = page.locator('button[title="Insertar"]').nth(10)
  await btnInsertarAsoc.click()

  const inputAsoc = page.locator('input#txtClienteClienteAsociado')
  await inputAsoc.fill('02250')
  const btnbuscAsoc = page.locator('button#cmdBuscar').nth(1)
  await btnbuscAsoc.click()
  const btngrabasoc = page.locator('button[type="submit"][title="Grabar"]').nth(2)
  await btngrabasoc.click()

  //Agregar cuenta bancaria
  const cuentabanc = page.locator('button.btn.btn-outline-dark[data-toggle="tooltip"][title="Insertar"]').nth(11)
  await cuentabanc.click()

  const banco = page.locator('input#txtCuentaBancariaBanco')
  await banco.fill('banco fr') //BANCO SANTAND en testingFZ
  const buscarbanco = page.locator('button#cmdBuscar').nth(5)
  await buscarbanco.click() 

  const sucursalban = page.locator('input#txtCuentaBancariaBancoSucursal')
  await sucursalban.fill('001') //5000
  const buscarsuc = page.locator('button#cmdBuscar').nth(6)
  await buscarsuc.click()

  const nrocuenta = page.locator('input#txtCuentaBancariaNumeroCuenta')
  await nrocuenta.fill('46118/778')
  const nrocbu = page.locator('input#txtCuentaBancariaCBU').nth(0)
  await nrocbu.fill('41821672185887')

  //grabar
  const bancograb = page.locator('button[type="submit"][title="Grabar"]').nth(7)
  await bancograb.click()

  //agregar vendedor
  const agregarVend = page.locator('button[title="Insertar"]').nth(12)
  await agregarVend.click()
  //const vended = page.getByRole('textbox',{name:'Vendedor:', exact: true})
  const vended = page.locator('input.form-control.form-control-sm[placeholder="Ingrese un valor para buscar..."]').nth(0)
  await vended.fill('01047') //09148
  const buscvended = page.locator('button#cmdBuscar').nth(0)
  await buscvended.click()

  const porcen = page.getByRole('textbox',{name:'% de participación:'})
  await porcen.fill('100')
  const grabvend = page.locator('button[type="submit"][title="Grabar"]').nth(1)
  await grabvend.click()
  //Grabar cliente
  await guardar.click()

  //const btnSi = await page.getByRole('button', {name:'Si'})
  //await btnSi.click()

  //vamos a filtrar por el nombre del cliente para verificar registro OK del mismo

  const btnFiltro = page.locator('button.btn.btn-outline-dark[title="Filtros"]')
  await btnFiltro.click()

  await page.getByRole('textbox', {name:'Búsqueda:'}).fill(nombreEsperado)
  await page.getByRole('button', {name:'Filtrar'}).click()

  const resultadofila =  await page.getByRole('cell', {name:nombreEsperado})
  await page.waitForTimeout(2000); //esperamos 2 seg
  
  // Esperar a que el elemento <td> esté visible
  await expect(resultadofila).toBeVisible();
  

  console.log('El cliente fue registrado correctamente')


  //Prueba de copia de cliente
  const btnCop = page.locator('button.btn.btn-outline-dark[title="Copiar"]')
  await btnCop.click()  
  await tipocuenta.selectOption('EMP');
  await guardar.click()

  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

  //despues de grabar el cliente con el mismo nombre solo cambiandole el tipo de cuenta, quedan 2 registros filtrados osea
  //hay que chequear que queden 2 registros

  async function obtenerTotalItems(page) {
    // Selecciona el elemento con el XPath
    const smallElement = await page.locator('xpath=//div[8]/span/small');
    // Obtener el texto del elemento
    const contenido = await smallElement.textContent();
    // Buscar el número en el texto
    const match = contenido.trim().match(/\d+/);
    // Convertir el número a entero y devolverlo
    const numero = match ? parseInt(match[0], 10) : NaN;
    return numero;
  }
  
  const totalreg = await obtenerTotalItems(page);
  

  await expect(totalreg).toBe(2)
  console.log('Se copió correctamente el cliente con nombre', nombreEsperado)

  //modificación del cliente copiado y luego eliminación
  const btnMod = page.locator('button.btn.btn-outline-dark[title="Modificar"]').nth(16)
  await btnMod.click()
  const valorcuentamod = 'BAN'
  await tipocuenta.selectOption(valorcuentamod); //cambiamos a tipo de cuenta mayorista, MAY en testingfz
  // lo guardamos en una variable y luego verificamos que el valor modificado quedó registrado como may es decir correctamente

  await guardar.click()
  await page.waitForTimeout(2000); //esperamos 2 seg
  await btnMod.click() //ingresamos al cliente modificado recien

  const tipocuentamod = await tipocuenta.inputValue()

  // Verifica que el valor sea 'MAY' es decir por el cual lo modificamos
  expect(tipocuentamod).toBe(valorcuentamod);
  console.log('El cliente fue modificado correctamente y ahora el tipo de cuenta es', tipocuentamod)

  // Eliminar el registro copiado
  const btncancelar = page.locator('button.btn.btn-danger[title="Cancelar"]').nth(15)
  await btncancelar.click()

  const btnEliminar = page.locator('button.btn.btn-outline-dark[title="Eliminar"]').nth(8)
  await btnEliminar.click()

  //ahora aparece una validación
  const valid2 = await page.getByRole('heading', { name: 'Clientes'})
  expect(valid2).toBeVisible
  console.log('Se verifica validación de eliminar cliente')
  await page.waitForTimeout(2000); //esperamos 2 seg
  const btnSi = page.getByRole('button', {name:'Si'})
  await btnSi.click()

  
  expect(valid2).toBeVisible
  console.log('Se verifica validación configurable')
  await page.waitForTimeout(2000); //esperamos 2 seg
  await btnSi.click()

  await page.waitForTimeout(6000); //esperamos 6 seg

  //verificamos que ahora los registros pasan de ser 2 a 1 ya que se eliminó el cliente
  const totclientes = await obtenerTotalItems(page);
  
  await expect(totclientes).toBe(1)
  console.log('Se eliminó correctamente el cliente')  

  await page.waitForTimeout(4000);

})