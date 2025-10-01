import { test, expect } from '@playwright/test'; //nos traemos el metodo test que ejecuta las pruebas y expect que nos hace las comprobaciones

test('PruebaLogin', async ({ page }) => {
  await page.goto('http://localhost/ssgWebBZ/Login'); //vamos a la web
  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  //await page.getByPlaceholder('Contraseña').press('Enter');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  const v = await page.getByRole('heading', { name: 'Indicadores de rendimiento (' }); //metemos la valid en una variable

  await expect(v).toBeVisible(); //validar con la frase de indicadores de rendimiento que el login fue exitoso

});


