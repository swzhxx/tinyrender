use wasm_bindgen::Clamped;
use web_sys::*;

pub struct TGAColor(u8, u8, u8, u8);
impl TGAColor {
    pub fn new(red: u8, green: u8, blue: u8, alpha: u8) -> Self {
        Self(red, green, blue, alpha)
    }
}

pub static RGB: TGAColor = TGAColor(0, 0, 0, 255);

pub struct Image {
    width: u32,
    height: u32,
    data: Vec<u8>,
}

impl Image {
    fn get_index(&self, row: u32, col: u32) -> u32 {
        if row > self.height || col > self.width || row < 0 || col < 0 {
            panic!("超出边界");
        }
        let index = (row * self.width + col) * 4 as u32;
        return index;
    }

    pub fn new(width: u32, height: u32, color: &TGAColor) -> Self {
        let mut data = vec![];
        for i in 0..width {
            for j in 0..height {
                data.push(color.0);
                data.push(color.1);
                data.push(color.2);
                data.push(color.3);
            }
        }
        Image {
            width,
            height,
            data: data,
        }
    }

    pub fn set(&mut self, row: u32, col: u32, color: &TGAColor) {
        let index = self.get_index(row, col) as usize;
        self.data[index] = color.0;
        self.data[index + 1] = color.1;
        self.data[index + 2] = color.2;
        self.data[index + 3] = color.3;
    }

    pub fn to_image_data(&self) -> ImageData {
        return ImageData::new_with_u8_clamped_array_and_sh(
            Clamped(&self.data),
            self.width,
            self.height,
        )
        .unwrap();
    }
}

pub fn image(width: u32, height: u32, color: &TGAColor) -> Image {
    return Image::new(width, height, &color);
}
