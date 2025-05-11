import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import path from "path";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
// Configuration de formidable
export const config = {
  api: {
    bodyParser: false, // Désactiver le parsing automatique de Next.js pour utiliser formidable
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Vérification de la session (utilisateur authentifié)
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Récupérer le nom d'utilisateur à partir de la session ou de la requête
    // const { username } = req.query; // username dans l'URL
    const username = session.user.username;

    if (!username) {
      return res.status(400).json({ message: "Nom d'utilisateur manquant" });
    }

    // Création du formulaire avec formidable
    const form = new formidable.IncomingForm({
      uploadDir: path.join(process.cwd(), "/public/images/avatars"), // Répertoire où l'avatar sera stocké
      keepExtensions: true, // Garder les extensions des fichiers
      maxFileSize: 10 * 1024 * 1024, // Taille maximale de fichier (10 Mo)
    });

    // Utilisation de la méthode `parse` pour analyser la requête
    form.parse(req, async (err: Error, fields, files) => {
      // Typage explicite des paramètres
      if (err) {
        return res.status(500).json({
          message: "Erreur lors du téléchargement de l'avatar",
          error: err.message,
        });
      }

      // Vérifie que l'avatar est bien téléchargé
      const avatarFile = files.avatar
        ? (files.avatar as formidable.File[])[0]
        : null; // Le fichier avatar
      if (!avatarFile) {
        return res.status(400).json({ message: "Aucun fichier téléchargé" });
      }
      // Vérification du type MIME du fichier téléchargé
      const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (
        avatarFile.mimetype &&
        !allowedImageTypes.includes(avatarFile.mimetype)
      ) {
        return res.status(400).json({
          message: "Le fichier téléchargé n'est pas une image valide",
        });
      }
      // Vérification de l'extension de l'image
      const fileExtension = path
        .extname(avatarFile.originalFilename || "")
        .toLowerCase();
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
      if (!allowedExtensions.includes(fileExtension)) {
        return res
          .status(400)
          .json({ message: "L'extension du fichier n'est pas valide" });
      }

      // Chemin du fichier téléchargé
      const avatarPath = `/images/avatars/${avatarFile.newFilename}`;

      // Mettre à jour l'utilisateur avec le chemin de l'avatar
      try {
        const user = await prisma.user.findUnique({
          where: { username: String(username) }, // Recherche l'utilisateur via son nom d'utilisateur
        });

        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        await prisma.user.update({
          where: { username: String(username) },
          data: { avatar: avatarPath },
        });

        return res.status(200).json({
          message: "Avatar téléchargé et mis à jour avec succès",
          avatarPath,
        });
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
      }
    });
  } else {
    res.status(405).json({ message: "Méthode HTTP non autorisée" });
  }
}
