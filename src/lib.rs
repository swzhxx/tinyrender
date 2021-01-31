use wasm_bindgen::prelude::*;

mod canvas_setup;
mod tagimage;

use tagimage::{Image, TGAColor};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    log("Hello from rust");
}

///第一次的尝试
// fn line(x0: u32, y0: u32, x1: u32, y1: u32, image: &mut Image, color: &TGAColor) {
//     let mut t = 0.;
//     loop {
//         let x = (x0 as f64 * (1. - t) + x1 as f64 * t) as u32;
//         let y = (y0 as f64 * (1. - t) + y1 as f64 * t) as u32;
//         t += 0.1;
//         image.set(x, y, color);
//         if t >= 1. {
//             break;
//         }
//     }
// }
/// 第二次尝试
/// line 第三条线 直接报错
// fn line2(x0: u32, y0: u32, x1: u32, y1: u32, image: &mut Image, color: &TGAColor) {
//     let mut x = x0;
//     loop {
//         let t: f64 = ((x - x0) as f64) / ((x1 - x0) as f64);
//         let y = y0 as f64 * (1. - t) + y1 as f64 * t;
//         image.set(x as u32, y as u32, color);
//         x += 1;

//         if x > x1 {
//             break;
//         }
//     }
// }

#[wasm_bindgen]
pub fn draw() {
    let width = 100;
    let height = 100;

    let mut context = canvas_setup::initialize_canvas().unwrap();
    let mut image = tagimage::image(width, height, &tagimage::RGB);
    // image.set(50, 50, &tagimage::TGAColor::new(255, 78, 78, 255));
    // line(
    //     13,
    //     20,
    //     80,
    //     40,
    //     &mut image,
    //     &TGAColor::new(255, 255, 255, 255),
    // );

    // line2(
    //     13,
    //     20,
    //     80,
    //     40,
    //     &mut image,
    //     &TGAColor::new(255, 255, 255, 255),
    // );
    // line2(20, 13, 40, 80, &mut image, &TGAColor::new(255, 0, 0, 255));
    // line2(80, 40, 13, 20, &mut image, &TGAColor::new(255, 0, 0, 255));
    context.put_image_data(&image.to_image_data(), 0., 0.);
}
