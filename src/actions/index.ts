"use server";

import { db } from "@/lib/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { Difficulty } from "@prisma/client";
import nodemailer from "nodemailer";

export const onAuthenticate = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { status: 404 };

    //check if user exists

    const existingUser = await db.user.findUnique({
      where: { clerkId: authUser.id },
      include: {
        workspaces: {
          where: {
            owner: {
              clerkId: authUser.id,
            },
          },
        },
      },
    });

    if (existingUser) return { data: existingUser, status: 200 };

    const newUser = await db.user.create({
      data: {
        clerkId: authUser?.id,
        email: authUser.emailAddresses[0].emailAddress,
        fullName: authUser.fullName || "",
        firstName: authUser.firstName || "",
        lastName: authUser.lastName || "",
        imageUrl: authUser.imageUrl,
        workspaces: {
          create: {
            name: "Personal Course Workspace",
            type: "PRIVATE",
          },
        },
      },
      include: {
        workspaces: {
          where: {
            owner: {
              clerkId: authUser.id,
            },
          },
        },
      },
    });

    if (newUser) return { data: newUser, status: 201 };
    return { status: 400 };
  } catch (error) {
    console.error("Authentication error:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

// model DigitalResource {
//   id          String   @id @default(uuid())
//   name        String
//   url         String   // Could be file storage link (S3, Supabase, etc.)
//   workspaceId String
//   workspace   Workspace @relation(fields: [workspaceId], references: [id])
//   uploadedBy  User     @relation(fields: [uploadedById], references: [id])
//   uploadedById String
//   createdAt   DateTime @default(now())
// }

export const getDigitalResources = async (workspaceId: string) => {
  try {
    const workspaceDigitalLibrary = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        digitalLibrary: {
          include: {
            uploadedBy: true,
            workspace: true,
          },
        },
      },
    });

    if (!workspaceDigitalLibrary) return { status: 400 };

    return { data: workspaceDigitalLibrary?.digitalLibrary, status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 500 };
  }
};

export const getUserbyClerkId = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { status: 404 };
    const user = await db.user.findUnique({
      where: { clerkId: authUser.id },
    });

    return { data: user, status: 200 };
  } catch (error) {
    console.log(error);
  }
};

export const createDigitalResource = async (
  data: {
    name: string;
    size: number;
    type: string;
    url: string;
  },
  workspaceId: string
) => {
  try {
    const user = await getUserbyClerkId();
    if (!user?.data?.clerkId) {
      throw new Error("User not found"); // Or provide a fallback value
    }

    const res = await db.digitalResource.create({
      data: {
        name: data.name,
        size: data.size,
        url: data.url,
        type: data.type,
        uploadedById: user.data.id, // Now guaranteed to be a string
        workspaceId: workspaceId,
      },

      include: {
        uploadedBy: true,
        workspace: true,
      },
    });

    return res;
  } catch (error) {
    console.log(error, "❌❌❌❌❌");
  }
};

import mammoth from "mammoth";

async function extractTextFromDocx(fileBlob: Blob) {
  try {
    const arrayBuffer = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.length < 100) {
      throw new Error("Extracted text is too short.");
    }

    return result.value;
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    return "Could not extract text from document.";
  }
}

async function fetchAndExtractText(fileUrl: string) {
  try {
    console.log("Downloading file from URL:", fileUrl);

    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to download file.");

    const fileBlob = await response.blob();
    console.log("Downloaded file blob:", fileBlob);

    const fileType = fileBlob.type;
    console.log("Detected file type:", fileType);

    let extractedText = "Could not extract text.";

    if (fileType.includes("word")) {
      extractedText = await extractTextFromDocx(fileBlob);
    } else if (fileType.includes("pdf")) {
      console.log("PDF extraction not implemented yet.");
    } else {
      throw new Error("Unsupported file type.");
    }

    console.log(
      "Extracted Text (first 200 chars):",
      extractedText.slice(0, 200)
    );

    return extractedText.slice(0, 1000); // Send more text to OpenAI for better quiz generation
  } catch (error) {
    console.error("Error extracting text:", error);
    return "Could not extract text.";
  }
}

// async function sendTextToOpenAI(
//   text: string,
//   numQuestions: number,
//   difficulty: string
// ) {
//   if (text.length < 100) {
//     console.error("Text must be at least 100 characters for OpenAI.");
//     return null;
//   }

//   const requestBody = {
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are an AI that generates quizzes from provided text. Output JSON with unique question IDs, multiple-choice options, and correct answers.",
//       },
//       {
//         role: "user",
//         content: `Generate a ${difficulty} quiz with ${numQuestions} questions based on this text. Output in JSON format like this:
//       [
//         { "id": "q1", "question": "What is the capital of France?", "options": ["Paris", "London", "Berlin", "Madrid"], "correctAnswer": "Paris" }
//       ]

//       Text:
//       ${text}`,
//       },
//     ],
//     temperature: 0.7,
//   };

//   const response = await fetch("https://api.openai.com/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(requestBody),
//   });

//   const data = await response.json();
//   console.log("OpenAI Quiz Response:", data);

//   try {
//     return JSON.parse(data.choices?.[0]?.message?.content || "[]");
//   } catch (error) {
//     console.error("Error parsing JSON response:", error);
//     return [];
//   }
// }

async function sendTextToDeepseekForQuizGeneration(
  text: string,
  numQuestions: number,
  difficulty: string
) {
  if (text.length < 100) {
    console.error("Text must be at least 100 characters for OpenAI.");
    return null;
  }

  const requestBody = {
    model: "deepseek/deepseek-r1:free",
    messages: [
      {
        role: "system",
        content:
          "You are an AI that generates quizzes from provided text. Output JSON with unique question IDs, multiple-choice options, and correct answers.",
      },
      {
        role: "user",
        content: `Generate a ${difficulty} quiz with ${numQuestions} questions based on this text. Output in JSON format like this:
        [
          { "id": "q1", "question": "What is the capital of France?", "options": ["Paris", "London", "Berlin", "Madrid"], "correctAnswer": "Paris" }
        ]
        Text:
        ${text}`,
      },
    ],
    temperature: 0.7,
  };

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();
    console.log("OpenRouter Quiz Response:", data);

    const rawContent = data.choices?.[0]?.message?.content || "[]";

    // **Sanitize the response to remove markdown formatting**
    const cleanedContent = rawContent.replace(/^```json\n|\n```$/g, "").trim();

    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error("Error fetching or parsing quiz:", error);
    return [];
  }
}

async function generateQuizFromText(
  fileUrl: string,
  numQuestions: number,
  difficulty: string
) {
  const text = await fetchAndExtractText(fileUrl);
  if (text) {
    // return sendTextToDeepseekForQuizGeneration(text, numQuestions, difficulty);
    return sendTextToDeepseekForQuizGeneration(text, numQuestions, difficulty);
  }

  console.log("No text extracted ❌");
  return null;
}

export const createQuiz = async (
  data: {
    title: string;
    resourceId: string;
    numOfQuestions: number;
    difficulty: Difficulty;
  },
  workspaceId: string
) => {
  try {
    const user = await getUserbyClerkId();
    const createdById = user?.data?.id;

    const resource = await db.digitalResource.findUnique({
      where: { id: data.resourceId },
      select: {
        url: true,
      },
    });

    const resourceUrl = resource?.url;
    if (!resource || !resourceUrl) throw new Error("No JSON response");

    const json = await generateQuizFromText(
      resourceUrl,
      data.numOfQuestions,
      data.difficulty
    );

    console.log(json);
    if (!json) throw new Error("No JSON response");

    if (!createdById) throw new Error("User ID is required");

    const newQuiz = await db.quiz.create({
      data: {
        title: data.title,
        numOfQuestions: data.numOfQuestions,
        // sourceDocument: data.resourceUrl,
        digitalResourceId: data.resourceId,
        createdById, // Now guaranteed to be a string
        workspaceId,
        difficulty: data.difficulty || Difficulty.MEDIUM,
        jsonData: json, // Add the jsonData field
      },
      include: {
        workspace: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            imageUrl: true,
          },
        },
        attempts: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                imageUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc", // Order attempts by most recent
          },
        },
        digitalResource: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log(newQuiz, "🔥🔥🔥🔥🔥✅✅✅✅✅");
    await updateStreak(createdById, workspaceId);
    return newQuiz;
  } catch (error) {
    console.error("Error creating quiz:", error);
  }
};

export const getQuizzies = async (workspaceId: string) => {
  return await db.quiz.findMany({
    where: { workspaceId },
    include: {
      workspace: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
      attempts: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc", // Order attempts by most recent
        },
      },
      digitalResource: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getQuiz = async (id: string) => {
  try {
    const currentUser = (await getUserbyClerkId())?.data;
    if (!currentUser) throw new Error("Error");
    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        workspace: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            imageUrl: true,
          },
        },
        attempts: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                imageUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc", // Order attempts by most recent
          },
        },
        digitalResource: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Format the quiz data
    const formattedQuiz = {
      id: quiz.id,
      title: quiz.title,
      numOfQuestions: quiz.numOfQuestions,
      difficulty: quiz.difficulty.toLowerCase(),
      workspace: quiz.workspace.name,
      createdBy: {
        name: quiz.createdBy.fullName,
        avatar:
          quiz.createdBy.imageUrl || "/placeholder.svg?height=32&width=32",
        initials: quiz.createdBy.fullName
          .split(" ")
          .map((name) => name[0])
          .join(""),
      },
      sourceDocument: quiz.digitalResource?.name || "Unknown Document",
      attempts: quiz.attempts.length,
      averageScore:
        quiz.attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
          quiz.attempts.length || 0,
      dateCreated: quiz.createdAt.toISOString(),
      myAttempts: quiz.attempts.filter(
        (attempt) => attempt.userId === currentUser.id // Replace with actual current user ID
      ).length,
      myBestScore:
        Math.max(
          ...quiz.attempts
            .filter((attempt) => attempt.userId === currentUser.id) // Replace with actual current user ID
            .map((attempt) => attempt.score)
        ) || 0,
      recentAttempts: quiz.attempts
        .slice(-5) // Get the last 5 attempts
        .map((attempt) => ({
          user: {
            name: attempt.user.fullName,
            avatar:
              attempt.user.imageUrl || "/placeholder.svg?height=32&width=32",
            initials: attempt.user.fullName
              .split(" ")
              .map((name) => name[0])
              .join(""),
          },
          score: attempt.score,
          date: attempt.createdAt.toISOString(), // Add the `date` field
        })),
    };

    return formattedQuiz;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

export const submitQuizAttempt = async ({
  quizId,
  score,
  timeSpent,
}: {
  quizId: string;
  score: number;
  timeSpent: number;
}) => {
  try {
    const currentUser = (await getUserbyClerkId())?.data; // Fetch the current user
    if (!currentUser) throw new Error("User not found");

    await db.quizAttempt.create({
      data: {
        userId: currentUser.id,
        quizId,
        score,
        timeSpent,
      },
    });
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    throw new Error("Failed to submit quiz attempt");
  }
};

// actions/quiz.ts

// actions/quiz.ts

// actions/quiz.ts

export const getQuizWithQuestions = async (quizId: string) => {
  try {
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            imageUrl: true,
          },
        },
        workspace: {
          select: {
            name: true,
          },
        },
        digitalResource: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Ensure `jsonData` is an array
    if (!Array.isArray(quiz.jsonData)) {
      throw new Error("Invalid questions format in jsonData");
    }

    // Format the data to match the `mockQuizData` structure
    const formattedData = {
      id: quiz.id,
      title: quiz.title,
      numOfQuestions: quiz.numOfQuestions,
      difficulty: quiz.difficulty.toLowerCase(), // Ensure lowercase to match mock data
      workspace: quiz.workspace.name,
      createdBy: {
        name: quiz.createdBy.fullName,
        avatar:
          quiz.createdBy.imageUrl || "/placeholder.svg?height=32&width=32",
        initials: quiz.createdBy.fullName
          .split(" ")
          .map((name) => name[0])
          .join(""),
      },
      sourceDocument: quiz.digitalResource?.name || "Unknown Document",
      questions: quiz.jsonData.map((question: any) => ({
        id: question.id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
      })),
    };

    return formattedData;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw new Error("Failed to fetch quiz");
  }
};

// export const getWorkspaces= async (id: string) => {

//   try {
//     const
//   } catch (error) {

//   }
// }

async function sendTextToDeepseekForFlashCardGeneration(
  text: string,
  numCards: number
  // difficulty?: string
) {
  if (text.length < 100) {
    console.error("Text must be at least 100 characters for OpenAI.");
    return null;
  }

  const requestBody = {
    model: "deepseek/deepseek-r1:free",
    messages: [
      {
        role: "system",
        content:
          "You are an AI that generates flashcards from provided text. Output JSON with unique card IDs, front (question), and back (answer).",
      },
      {
        role: "user",
        content: `Generate a flashcard set with ${numCards} cards based on this text. Output in JSON format like this:
        [
          {
            "id": "c1",
            "front": "What is a derivative?",
            "back": "A derivative measures the rate at which a function is changing at a given point. It represents the slope of the tangent line to the function at that point."
          }
        ]
        Text:
        ${text}`,
      },
    ],
    temperature: 0.7,
  };

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();
    console.log("OpenRouter Flashcard Response:", data);

    const rawContent = data.choices?.[0]?.message?.content || "[]";

    // **Sanitize the response to remove markdown formatting**
    const cleanedContent = rawContent.replace(/^```json\n|\n```$/g, "").trim();

    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error("Error fetching or parsing flashcards:", error);
    return [];
  }
}

async function generateFlashcardsFromText(
  fileUrl: string,
  numCards: number
  // difficulty: string
) {
  const text = await fetchAndExtractText(fileUrl); // Assuming fetchAndExtractText is already implemented
  if (text) {
    // return sendTextToDeepseekForFlashCardGeneration(text, numCards, difficulty);
    return sendTextToDeepseekForFlashCardGeneration(text, numCards);
  }

  console.log("No text extracted ❌");
  return null;
}

export const createFlashcardSet = async (
  data: {
    title: string;
    resourceId: string;
    numOfCards: number;
    // difficulty: Difficulty;
  },
  workspaceId: string
) => {
  try {
    const user = await getUserbyClerkId(); // Assuming this function is already implemented
    const createdById = user?.data?.id;

    // Fetch the resource URL from the database
    const resource = await db.digitalResource.findUnique({
      where: { id: data.resourceId },
      select: {
        url: true,
      },
    });

    const resourceUrl = resource?.url;
    if (!resource || !resourceUrl) throw new Error("Resource not found");

    // Generate flashcards using the text from the resource
    const json = await generateFlashcardsFromText(
      resourceUrl,
      data.numOfCards
      // data.difficulty
    );

    console.log(json);
    if (!json) throw new Error("No JSON response");

    if (!createdById) throw new Error("User ID is required");

    // Create the flashcard set in the database
    const newFlashcardSet = await db.flashcard.create({
      data: {
        title: data.title,
        numOfCards: data.numOfCards,
        digitalResourceId: data.resourceId,
        createdById, // Now guaranteed to be a string
        workspaceId,
        jsonData: json, // Store the generated flashcards as JSON
      },
      include: {
        workspace: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            imageUrl: true,
          },
        },
        digitalResource: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log(newFlashcardSet, "🔥🔥🔥🔥🔥✅✅✅✅✅");

    return newFlashcardSet;
  } catch (error) {
    console.error("Error creating flashcard set:", error);
  }
};

export const getFlashcards = async (workspaceId: string) => {
  return await db.flashcard.findMany({
    where: { workspaceId },
    include: {
      workspace: {
        select: {
          name: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          fullName: true,
          imageUrl: true,
        },
      },
      digitalResource: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getFlashcard = async (id: string) => {
  try {
    const currentUser = (await getUserbyClerkId())?.data;
    if (!currentUser) throw new Error("User not found");

    const flashcardSet = await db.flashcard.findUnique({
      where: { id },
      include: {
        workspace: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            imageUrl: true,
          },
        },
        digitalResource: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!flashcardSet) {
      throw new Error("Flashcard set not found");
    }

    // Format the flashcard set data
    const formattedFlashcardSet = {
      id: flashcardSet.id,
      title: flashcardSet.title,
      numOfCards: flashcardSet.numOfCards,
      workspace: flashcardSet.workspace.name,
      createdBy: {
        name: flashcardSet.createdBy.fullName,
        avatar:
          flashcardSet.createdBy.imageUrl ||
          "/placeholder.svg?height=32&width=32",
        initials: flashcardSet.createdBy.fullName
          .split(" ")
          .map((name) => name[0])
          .join(""),
      },
      sourceDocument: flashcardSet.digitalResource?.name || "Unknown Document",
      dateCreated: flashcardSet.createdAt.toISOString(),
      mastery: 0, // Placeholder for mastery calculation
      cardsToReview: 0, // Placeholder for cards to review
      tags: [], // Placeholder for tags
      lastStudied: null, // Placeholder for last studied date
      cards: flashcardSet.jsonData as Array<{
        id: string;
        front: string;
        back: string;
      }>,
      studyHistory: [], // Placeholder for study history
    };

    return formattedFlashcardSet;
  } catch (error) {
    console.error("Error fetching flashcard set:", error);
    throw error;
  }
};

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    to,
    subject,
    text,
    html,
  };

  return { transporter, mailOptions };
};

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { status: 404 };

    //check if the user is the workspace owner or is part of the workspace
    const isUserInWorkspace = await db.workspace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            owner: {
              clerkId: authUser.id,
            },
          },
          {
            members: {
              some: {
                user: {
                  clerkId: authUser.id,
                },
              },
            },
          },
        ],
      },
    });

    return {
      status: 200,
      data: isUserInWorkspace,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 403,
      data: null,
    };
  }
};

export const inviteMember = async (
  workspaceId: string,
  recieverId: string,
  email: string
) => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { status: 404 };

    const senderInfo = await db.user.findUnique({
      where: { clerkId: authUser.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (senderInfo?.id) {
      const workspace = await db.workspace.findUnique({
        where: { id: workspaceId },
        select: {
          name: true,
        },
      });

      if (workspace) {
        const invitation = await db.invite.create({
          data: {
            senderId: senderInfo.id,
            recieverId,
            workspaceId: workspaceId,
            content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
          },
          select: {
            id: true,
          },
        });

        //notification
        await db.user.update({
          where: {
            clerkId: authUser.id,
          },
          data: {
            notifications: {
              create: {
                content: `${authUser.firstName} ${authUser.lastName} invited ${senderInfo.firstName} into ${workspace.name}`,
              },
            },
          },
        });

        if (invitation) {
          const { transporter, mailOptions } = await sendEmail(
            email,
            "You got an invitation",
            "You are invited to join ${workspace.name} Workspace, click accept to confirm",
            `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
          );

          transporter.sendMail(mailOptions, (error: any, info: any) => {
            if (error) {
              console.log("🔴", error.message);
            } else {
              console.log("✅ Email send", info);
            }
          });
          return { status: 200, data: "Invite sent" };
        }
        return { status: 400, data: "invitation failed" };
      }
      return { status: 404, data: "workspace not found" };
    }
    return { status: 404, data: "recipient not found" };
  } catch (error) {
    console.log(error);
  }
};

export const acceptInvite = async (inviteId: string) => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { status: 404 }; // User not found

    const invitation = await db.invite.findUnique({
      where: { id: inviteId },
      select: {
        workspaceId: true,
        reciever: {
          select: {
            clerkId: true,
          },
        },
      },
    });

    if (
      !invitation ||
      !invitation.workspaceId ||
      authUser.id !== invitation.reciever?.clerkId
    ) {
      return { status: 401 }; // Unauthorized or invitation not found
    }

    // Define the queries (do not await them yet)
    const acceptInviteQuery = db.invite.update({
      where: { id: inviteId },
      data: { accepted: true },
    });

    const updateMemberQuery = db.user.update({
      where: { clerkId: authUser.id },
      data: {
        userWorkspaces: {
          create: {
            workspaceId: invitation.workspaceId,
          },
        },
      },
    });

    // Pass the query objects (not executed promises) to $transaction
    const membersTransaction = await db.$transaction([
      acceptInviteQuery,
      updateMemberQuery,
    ]);

    if (membersTransaction) return { status: 200 }; // Success
    return { status: 400 };
  } catch (error) {
    console.error("Error accepting invite:", error);
    return { status: 400 }; // Internal server error
  }
};

export const getWorkspaces = async () => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { status: 404 };

    const workspaces = await db.user.findUnique({
      where: {
        clerkId: authUser.id,
      },

      select: {
        workspaces: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        userWorkspaces: {
          select: {
            workspace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });
    if (workspaces) {
      return { status: 200, data: workspaces };
    }
  } catch (error) {
    console.error("Error:", error); // Log the error
    return { status: 400 };
  }
};

export const createWorkpace = async (name: string) => {
  const authUser = await currentUser();
  if (!authUser) return { status: 404 };

  try {
    const workspace = await db.user.update({
      where: { clerkId: authUser.id },
      data: {
        workspaces: {
          create: { name, type: "PUBLIC" },
        },
      },
    });

    if (workspace) {
      return { status: 201, data: "Workspace Created" };
    }
    return {
      status: 401,
      data: "You are not authorized to create a workspace.",
    };
  } catch (error) {
    console.log(error);
    return { status: 400 };
  }
};

export const searchUsersByQuery = async (query: string) => {
  try {
    const authUser = await currentUser();
    if (!authUser) return { status: 404 };

    const users = await db.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query } },
          { email: { contains: query } },
          { lastName: { contains: query } },
        ],
        NOT: [{ clerkId: authUser.id }],
      },
      select: {
        id: true,

        firstName: true,
        lastName: true,
        imageUrl: true,
        email: true,
      },
    });

    if (users && users.length > 0) {
      return { status: 200, data: users };
    }

    return { status: 404, data: undefined };
  } catch (error) {
    console.log(error);
    return { status: 500, data: undefined };
  }
};

import { revalidatePath } from "next/cache";

export const getPreferences = async () => {
  try {
    const res = await getUserbyClerkId();
    const user = res?.data;

    if (!res || !user) return;

    const preferences = await db.preferences.findUnique({
      where: {
        userId: user.id,
      },
    });

    return (
      preferences || {
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
      }
    );
  } catch (error) {
    console.error("Error fetching preferences:", error);
    throw new Error("Failed to fetch preferences");
  }
};

export const updatePreferences = async (preferences: {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}) => {
  try {
    const res = await getUserbyClerkId();
    const user = res?.data;

    if (!res || !user) return;

    const updatedPrefs = await db.preferences.upsert({
      where: {
        userId: user.id,
      },
      update: preferences,
      create: {
        userId: user.id,
        ...preferences,
      },
    });

    revalidatePath("/");
    return updatedPrefs;
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw new Error("Failed to update preferences");
  }
};

export const getStats = async () => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's sessions
    const todaysSessions = await db.session.count({
      where: {
        user: {
          clerkId: user.id,
        },
        createdAt: {
          gte: today,
        },
      },
    });

    // Total sessions
    const totalSessions = await db.session.count({
      where: {
        userId: user.id,
      },
    });

    // Total focus time in hours
    const focusTime = await db.session.aggregate({
      where: {
        userId: user.id,
        type: "FOCUS",
      },
      _sum: {
        duration: true,
      },
    });

    // Current streak
    const currentStreak = await db.streak.findFirst({
      where: {
        userId: user.id,
        current: true,
      },
    });

    return {
      todaysSessions,
      todaysXp: todaysSessions * 15,
      totalSessions,
      totalFocusHours: (focusTime._sum.duration || 0) / 60,
      currentStreak: currentStreak?.daysCount || 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw new Error("Failed to fetch stats");
  }
};

export const createSession = async (sessionData: {
  duration: number;
  type: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
}) => {
  try {
    const res = await getUserbyClerkId();
    const user = res?.data;

    if (!res || !user) throw new Error("unauthrized");
    // Validate session data
    if (!sessionData.duration || !sessionData.type) {
      throw new Error("Invalid session data");
    }

    const newSession = await db.session.create({
      data: {
        userId: user.id,
        duration: sessionData.duration,
        type: sessionData.type,
        xpEarned: calculateXp(sessionData.duration), // Added XP calculation
      },
    });

    // Update streak after successful session creation
    // await updateStreak(user.id);

    return newSession;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error; // Re-throw the original error for better debugging
  }
};

// Helper function to calculate XP based on duration
const calculateXp = (duration: number) => {
  // Example: 15 XP for standard 25-minute session, scaled for other durations
  return Math.round((duration / 25) * 15);
};

// const updateStreak = async (userId: string) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     // Check if user had a session yesterday
//     const hadSessionYesterday = await db.session.count({
//       where: {
//         userId,
//         createdAt: {
//           gte: yesterday,
//           lt: today,
//         },
//       },
//     });

//     const currentStreak = await db.streak.findFirst({
//       where: {
//         userId,
//         current: true,
//       },
//     });

//     if (hadSessionYesterday) {
//       // Continue current streak
//       if (currentStreak) {
//         await db.streak.update({
//           where: { id: currentStreak.id },
//           data: {
//             daysCount: currentStreak.daysCount + 1,
//           },
//         });
//       } else {
//         // Start new streak
//         await db.streak.create({
//           data: {
//             userId,
//             startDate: today,
//             current: true,
//             daysCount: 1,
//           },
//         });
//       }
//     } else {
//       // End current streak if exists
//       if (currentStreak) {
//         await db.streak.update({
//           where: { id: currentStreak.id },
//           data: {
//             current: false,
//             endDate: yesterday,
//           },
//         });
//       }
//       // Start new streak
//       await db.streak.create({
//         data: {
//           userId,
//           startDate: today,
//           current: true,
//           daysCount: 1,
//         },
//       });
//     }
//   } catch (error) {
//     console.error("Error updating streak:", error);
//   }
// };

// actions.ts

export const getFlashcardSet = async (id: string) => {
  try {
    const flashcardSet = await db.flashcard.findUnique({
      where: { id },
      include: {
        workspace: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            fullName: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!flashcardSet) {
      throw new Error("Flashcard set not found");
    }

    return {
      ...flashcardSet,
      cards: flashcardSet.jsonData as Array<{
        id: string;
        front: string;
        back: string;
      }>,
      mastery: 0, // You'll need to calculate this based on user progress
      cardsToReview: 0, // You'll need to calculate this based on user progress
      tags: [], // Add tags if you have them in your schema
      lastStudied: null, // Track this if you have study history
    };
  } catch (error) {
    console.error("Error fetching flashcard set:", error);
    throw error;
  }
};

export const deleteDigitalResource = async (id: string) => {
  try {
    const res = await db.digitalResource.delete({
      where: { id },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateStreak = async (userId: string, workspaceId?: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get the user's latest streak
  const lastStreak = await db.streak.findFirst({
    where: { userId, workspaceId, current: true },
    orderBy: { startDate: "desc" },
  });

  if (!lastStreak) {
    // No existing streak, create a new one
    await db.streak.create({
      data: {
        userId,
        workspaceId,
        startDate: today,
        daysCount: 1,
        current: true,
      },
    });
    return;
  }

  // Check if the last streak was yesterday
  const lastUpdated = new Date(lastStreak.startDate);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (lastUpdated.toDateString() === yesterday.toDateString()) {
    // Increment streak
    await db.streak.update({
      where: { id: lastStreak.id },
      data: { daysCount: lastStreak.daysCount + 1, startDate: today },
    });
  } else if (lastUpdated.toDateString() !== today.toDateString()) {
    // Reset streak if user missed a day
    await db.streak.update({
      where: { id: lastStreak.id },
      data: { current: false, endDate: lastUpdated },
    });

    await db.streak.create({
      data: {
        userId,
        workspaceId,
        startDate: today,
        daysCount: 1,
        current: true,
      },
    });
  }
};

export async function getCurrentStreak() {
  const res = await getUserbyClerkId();
  const userId = res?.data?.id;

  if (!res || !userId) return;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Find the latest active streak for the user
  const streak = await db.streak.findFirst({
    where: {
      userId,
      current: true,
    },
    orderBy: {
      startDate: "desc", // Get the most recent streak
    },
  });

  // // If no streak is found, return null
  // if (!streak) return null;

  // // Check if the streak is still active
  // const now = new Date();
  // const lastUpdated = new Date(streak.updatedAt);
  // const diffInHours =
  //   (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

  // if (streak.endDate || diffInHours > 24) {
  //   return null; // Streak has ended
  // }

  return streak; // Return the active streak
}

export const getUsersWithStreak = async (id: string) => {
  const res = await db.streak.findMany({
    where: { workspaceId: id, current: true },
    select: {
      user: {
        select: {
          fullName: true,
        },
      },
      daysCount: true,
    },
  });

  const streak = res.map((streak) => ({
    name: streak.user.fullName,
    score: streak.daysCount * 100,
  }));

  return streak;
};

export const getDigitalResouceCount = async (
  workspaceId: string
): Promise<number> => {
  try {
    const count = await db.digitalResource.count({
      where: {
        workspaceId: workspaceId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error fetching digital resource count:", error);
    throw new Error("Failed to fetch digital resource count");
  }
};

export const getQuizCount = async (workspaceId: string): Promise<number> => {
  try {
    const count = await db.quiz.count({
      where: {
        workspaceId: workspaceId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error fetching quiz count:", error);
    throw new Error("Failed to fetch quiz count");
  }
};

export const getFlashCardCount = async (
  workspaceId: string
): Promise<number> => {
  try {
    const count = await db.flashcard.count({
      where: {
        workspaceId: workspaceId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error fetching flashcard count:", error);
    throw new Error("Failed to fetch flashcard count");
  }
};
