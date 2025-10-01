import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(180000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/ssgBZ001/Articulo');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  await page.getByPlaceholder('Contraseña').press('Enter');

  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ001/Articulo');

  
  console.log('Inicio de sesión exitoso');


  await page.waitForTimeout(3000); // Espera 3 segundos para que la página se actualice

  const agregar = await page.getByRole('button', { name: '+' })
  await agregar.click();

  const codart = await page.getByRole('textbox', {name:'Código'}).inputValue();

  //cargamos datos

  const txtboxdescrip = await page.getByRole('textbox', {name:'Descripción:'})
  await txtboxdescrip.fill('nuevo articulo')
  
  const grab = await page.locator('button.btn.btn-success[title="Grabar"]').nth(4)
  await grab.click()
  
  const advertencia = await page.getByRole('heading', { name: 'Articulo'})
  
  expect(advertencia).toBeVisible
  await page.waitForTimeout(2000);

  console.log('Se verifica validación de ingresar centro operativo para articulo')
  
  

  await page.getByRole('button', {name:'Aceptar'}).click()
  await page.waitForTimeout(4000);


  //carga de nombre fantasia
  const txtboxfantasi = await page.getByRole('textbox', {name:'Nombre de fantasía:'})
  await txtboxfantasi.fill('nombre fantasia')
  //carga de centro op
  const txtboxcentro = await page.getByRole('textbox', {name:'Centro operativo:'})
  await txtboxcentro.fill('38') //llenar centro op
  // Localizador específico para el botón de "Buscar"
  const buscarButton = await page.locator('button#cmdBuscar.btn.btn-sm.btn-outline-dark[data-toggle="tooltip"][title="Buscar"]').nth(2);
  await buscarButton.click()
  await page.waitForTimeout(1000);


  const combounidad = await page.getByRole('combobox', {name:'Unidad de medida:'}).first()
  //seleccionamos unidad de medida Kilos del combobox
  await combounidad.selectOption('KGS')  
  
  //carga de Marca
  const txtboxmarca = await page.getByRole('textbox', {name:'Marca:'})
  await txtboxmarca.fill('sa') 
  const buscarButtonmarca = await page.locator('button#cmdBuscar.btn.btn-sm.btn-outline-dark[data-toggle="tooltip"][title="Buscar"]').nth(3);
  await buscarButtonmarca.click()
  await page.waitForTimeout(1000);

  //Boton de "+"" Agregar proveedor
  const agregarProv = await page.locator('button.btn.btn-outline-dark[data-toggle="tooltip"][data-placement="top"][title="Insertar"]').first()
  await agregarProv.click()  
  
  //carga de Proveedor
  const txtboxProv = await page.getByRole('textbox', {name:'Proveedor:', exact: true})
  await txtboxProv.waitFor()
  await txtboxProv.fill('02308')   
  
  //boton de buscar proveedor
  const buscarButtonProv = await page.locator('button#cmdBuscar.btn.btn-sm.btn-outline-dark[data-toggle="tooltip"][title="Buscar"]').first()
  await buscarButtonProv.click()
  await page.waitForTimeout(1000);

  const comboMoneda = await page.getByRole('combobox', {name:'Moneda:'}).first()
  //seleccionamos moneda
  await comboMoneda.selectOption('PE')  
  
  const grabprov = await page.locator('button.btn.btn-success[data-toggle="tooltip"][data-placement="top"][title="Grabar"]').first()
  await grabprov.click()  
  
  //Boton de "+"" Agregar codigo de barras
  //const agregarcodba = await page.locator('button.btn.btn-outline-dark[data-toggle="tooltip"][data-placement="top"][title="Insertar"]').nth(1)
  

  // Usamos la clase 'container-fluid'
  const contenedorCodigoDeBarras = page.locator('div.container-fluid:has-text("Código de Barras")');

  // 2. OBJETIVO: Dentro de ese contenedor, buscamos el botón por su rol y nombre accesible.
  // El 'name' lo toma del atributo 'title="Insertar"'.
  const agregarcodba = contenedorCodigoDeBarras.getByTitle('Insertar');
  await agregarcodba.click()

  //carga de codigo de barra
  const txtboxcodba = await page.getByRole('textbox', {name:'Código de Barras:'})
  await txtboxcodba.fill('11111111122233222244')
  
  const grabcbarra = await page.locator('button.btn.btn-success[data-toggle="tooltip"][data-placement="top"][title="Grabar"]').nth(1)
  await grabcbarra.click()

  //Boton de "+"" Agregar Combo
  const tabCombo = page.getByRole('tab', {name:'Combos'})
  await tabCombo.click()
  //const agregarcombo = await page.locator('button.btn.btn-outline-dark[data-toggle="tooltip"][data-placement="top"][title="Insertar"]').nth(2)
    // Usamos la clase 'container-fluid'
  const contenedorCombos = page.locator('div.container-fluid:has-text("Combos")');

  // 2. OBJETIVO: Dentro de ese contenedor, buscamos el botón por su rol y nombre accesible.
  // El 'name' lo toma del atributo 'title="Insertar"'.
  const agregarcombo = contenedorCombos.getByTitle('Insertar');
  await agregarcombo.click()    

  const txtarticulo = await page.getByRole('textbox', {name:'Artículo:'})
  await txtarticulo.fill('0000014')  
  
  //boton de buscar articulo combo
  const buscarButtonCombo = await page.locator('button#cmdBuscar.btn.btn-sm.btn-outline-dark[data-toggle="tooltip"][title="Buscar"]').nth(1)
  await buscarButtonCombo.click()
  await page.waitForTimeout(1000);

  //cargamos la cantidad
  const txtcant = await page.getByRole('textbox', {name:'Cantidad:'})
  await txtcant.fill('2')    
  //guardamos el combo
  const grabcombo = await page.locator('button.btn.btn-success[data-toggle="tooltip"][data-placement="top"][title="Grabar"]').nth(2)
  await grabcombo.click()

  //Ficha Opciones

  const tabopciones = await page.getByRole('tab', {name:'Opciones'})
  await tabopciones.click()
  
  //en combobox seleccionamos que actualiza "Costo y lista de todos los prov"
  const actprecio = await page.getByRole('combobox', {name:'Actualiza precio:'})
  await actprecio.selectOption('apPrecioListaProveedor')

  await page.waitForTimeout(1000);


  //ficha Impuestos

  const tabImp = await page.getByRole('tab', {name:'Impuestos'})
  await tabImp.click()
  //seleccion iva del 21%
  const aliva = await page.getByRole('combobox', {name:'I.V.A.:'})
  await aliva.selectOption('IVAMFA')


  //ficha Observaciones
  const tabObs = await page.getByRole('tab', {name:'Observaciones'})
  await tabObs.click()

  const txtareaobs = await page.locator('textarea.form-control.form-control-sm')
  await txtareaobs.fill('Esto es una observación de prueba')


  //ficha Otros
  //const tabOtr = await page.getByRole('tab', {name:'Otros'}) NO ES NECESARIO
 
  const txt1 = await page.locator('input.form-control.form-control-sm').nth(38)
  await txt1.fill('001')
  
  const txt3 = await page.locator('input.form-control.form-control-sm').nth(39)
  await txt3.fill('003')

  const importe1 = await page.locator('input.form-control.form-control-sm').nth(45)
  await importe1.fill('2500')

  //Ficha principios activos
  const tabPr = await page.getByRole('tab', {name:'Principio activo'})
  await tabPr.click()

  const txtpr = await page.getByRole('textbox', {name:'Principio activo:'})
  await txtpr.fill('aba')    

  //boton de buscar principio activo
  const buscarButtonPr = await page.locator('button#cmdBuscar.btn.btn-sm.btn-outline-dark[data-toggle="tooltip"][title="Buscar"]').nth(7)
  await buscarButtonPr.click()
  await page.waitForTimeout(1000);

  const checkboxFito = await page.getByRole('checkbox', { name: 'Producto fitosanitario'});
  await checkboxFito.check();



  //Ficha Senasa
  const tabSe = await page.getByRole('tab', {name:'Senasa'})
  await tabSe.click()


  //boton de buscar principio activo
  //const agregarSenasa = await page.locator('button.btn.btn-outline-dark[data-toggle="tooltip"][data-placement="top"][title="Insertar"]').nth(3)
    // Usamos la clase 'container-fluid'
  const contenedorSenasa = page.locator('div.container-fluid:has-text("Senasa")');

  // 2. OBJETIVO: Dentro de ese contenedor, buscamos el botón por su rol y nombre accesible.
  // El 'name' lo toma del atributo 'title="Insertar"'.
  const agregarSenasa = contenedorSenasa.getByTitle('Insertar');
  await agregarSenasa.click()
  const codsen = await page.getByRole('textbox', {name:'Código Senasa:'})

  // Date.now() da 13 dígitos, le sumamos un número aleatorio del 0 al 9 para llegar a 14.
  const codigoUnicoDe14 = Date.now().toString() + Math.floor(Math.random() * 10);

  await codsen.fill(codigoUnicoDe14);
  console.log('Código único de 14 dígitos Senasa:', codigoUnicoDe14);
  //await codsen.fill('07790001000096')
  const cantsenasa = await page.getByRole('textbox', {name:'Cantidad:'})
  await cantsenasa.fill('1')
  //grabamos senasa
  const grabsenasa = await page.locator('button.btn.btn-success[data-toggle="tooltip"][data-placement="top"][title="Grabar"]').nth(3)
  await grabsenasa.click()


  //Ficha ArPOV
  const ArPOV = await page.getByRole('tab', {name:'ArPOV'})
  await ArPOV.click()

  const combocat = await page.getByRole('combobox', {name:'Categoria:'})
  await combocat.selectOption('UsoPropio')

  const variedadtext = await page.getByRole('textbox', {name:'Variedad:'})
  await variedadtext.fill('pr')
  await variedadtext.press('Enter')


  //grabamos el artículo
  const grabarArt = await page.locator('button.btn.btn-success[data-toggle="tooltip"][data-placement="top"][title="Grabar"]').nth(4)
  await grabarArt.click()
  await page.waitForTimeout(5000);

  const navArticulos = page.locator('nav:has-text("Articulos"):visible')
  const btnfiltro = navArticulos.getByTitle('Filtros')
  //const btnfiltros = await page.locator('button.btn.btn-outline-dark[data-toggle="tooltip"][data-placement="top"][title="Filtros"]').nth(2)
  await btnfiltro.click()

  const busq = await page.getByRole('textbox', {name:'Búsqueda:'})
  await busq.fill(codart)
  
  //const btnfiltrar = await page.getByRole('button', {name:'Filtrar:'})
  
  const btnfiltrar = await page.locator('button#cmdFiltro.btn.btn-primary[type="submit"]')
  await btnfiltrar.click()

  const resultadofila =  await page.getByRole('cell', {name:codart})

  // Esperar a que el elemento <td> esté visible
  await expect(resultadofila).toBeVisible();
  const btnEliminar = navArticulos.getByTitle('Eliminar')
  await btnEliminar.click()
  const ValidAnular = page.locator('div.modal-dialog', {hasText:'¿Está seguro de borrar el ítem seleccionado?'}) //REFACTORIZAR
  expect(ValidAnular).toBeVisible()
  console.log('Se visualiza correctamente validación de si está seguro de borrar el articulo')

  const anularsi = ValidAnular.getByRole('button', { name: 'Si', exact: true })
  await anularsi.click()
  await expect(resultadofila).not.toBeVisible({ timeout: 10000 });

  console.log('Verificación exitosa: El artículo fue eliminado');

  await page.waitForTimeout(4000);


});