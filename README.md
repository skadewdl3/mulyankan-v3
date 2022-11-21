# What is Mulyankan ?

_Mulyankan_ (meaning 'evaluation' in Sanskrit) is a PDF mark-up tool geared towards teachers.

Since the COVID-19 pandemic, teachers have had to check some/most of their exam papers online. While tools like Google Forms are not alaways viable for written tests,
conventional PDF editors are too expensive for the average teacher. This is where Mulyankan comes in.

![image](https://user-images.githubusercontent.com/43989259/202834454-d5f8d58d-0f5a-40f8-81dc-06510a2bf11d.png)



# Why Mulyankan ?

1. Mulyankan is free - We believe education should not be hindered by factors like money, hence Mulyankan is free, forever.
2. Easy to use - We partenered up with teachers, and with extensive feedback and testing have produced a user-experience so that even a new user of Mulyankan will feel right at home.
3. Rich feature set - Mulyankan has all the features you need, and none of the ones you don't. Be it tilted, out-of-order PDFs or blurry ones, with features like **Preprocess** and **Zoom**, Mulyankan has you covered!
4. Cloud Saving - Sometimes when in a hurry, we forget to save our work. With Mulyankan, you can save your projects to the cloud. Just click one button and we'll do the rest for you!



# I've got a feature request / I found a bug !

We're always looking forward to adding new features and squashing existing bugs. You can contact us below and we'll be sure to respond ASAP.
- [ ] [sohamk10@gmail.com](mailto:sohamk10@gmail.com)
- [ ] [Discord - skadewdl3#7795](https://discord.com/users/skadewdl3#7795)



# Feature Roadmap / Progress

- [ ] First Release (coming soon)
- [ ] Cloud Saving (work in progress)
- [ ] Clipboard (work in progress)
- [ ] Math Equation Editor
- [ ] Better Download Qualtiy (Server Processing)



# Details for Geeks / Devs / OSS Enthusiasts 

Mulyankan works using Mozilla's PDF.js library. All the editing / conversion of the PDF is done in the browser itself. The cloud saving capabilities are powered by the amazing [Deta](https://deta.sh) platform.

The app works by converting the PDF to images (using PDF.js), which are then displayed and edited using Fabric.js. Currently, after downloading the PDF the text present in the PDF doesn't remain editable.
This will soon be fixed by using a Deta Micro to process the PDFs.

If anyone wants to contribute to the project, it's all OSS. You can fork it and get cracking. I'd love some help developing this app (cuz school stuff).
Feel free to hit me up on [Discord - skadewdl3#7795](https://discord.com/users/skadewdl3#7795) or [Email](mailto:sohamk10@gmail.com) and I'll be sure to help you get your bearings!


# How to add translations ?

Mulyankan wants to support teachers in all countries, hence we've included translaitons of the app in different languages. You too, can contribute translations in your language or suggest updates in existing ones! Follow this process to get started:

1) Fork the repo to your account on GitHub.
2) Create a new branch for translations.
3) Go into the backend/translaitons folder (translations are fetched as needed from the server).
4) Follow the instructions in the translations.js file.
5) Create a pull request and I'll try to merge it ASAP.
