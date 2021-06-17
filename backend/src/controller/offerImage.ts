import express = require("express")
import { getConnection } from "typeorm";
import { OfferImage, Offer } from "../entity";

// get offer Images
export async function getAllOfferImages(
  req: express.Request,
  res: express.Response) {

  // write function
}

// create offer Image
export async function createOfferImage(
  req: express.Request,
  res: express.Response
) {
  const id = req.body.offerId;
  const offerRepository = getConnection().getRepository(Offer);
  const offer = await offerRepository.findOne({ id });
  const offerImageRepository = getConnection().getRepository(OfferImage);

  const createOfferImage = [];
  const files = req.files as Express.Multer.File[];

  if (files.length && offer) {
    for (let i = 0; i < files.length; i++) {
      const offerImage = new OfferImage();
      offerImage.path = files[i].path;
      offerImage.originalname = files[i].originalname;
      offerImage.offer = offer;

      const savedOfferImage = await offerImageRepository.save(offerImage);
      createOfferImage.push(savedOfferImage);
    }

    res.json({ msg: "Image added" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Image not found" }] });
  }

}

// update offer Image
export async function updateOfferImage(
  req: express.Request,
  res: express.Response
) {

}

// delete offer Image 
export async function deleteOfferImage(
  req: express.Request,
  res: express.Response
) {
  const Id = req.params.offerImageId;
  const offerImageRepository = getConnection().getRepository(OfferImage);
  const imageToUpdate = await offerImageRepository.findOne({ id: Id });
  if (imageToUpdate) {
    try {
      await offerImageRepository.delete(Id);
      res.json({ msg: "image deleted" });
    } catch (e) {
      res.status(400).json({ msg: e });
    }
  } else {
    res.status(400).json({
      errors: [{ msg: "Offer image to delete not found or invalid id" }],
    });
  }

}