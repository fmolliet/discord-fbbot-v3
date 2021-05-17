const emojis =  [ ':smiley_cat:',':smile_cat:',':joy_cat:',':heart_eyes_cat:',':smirk_cat:',':kissing_cat:','🐱‍👤','🐱‍🏍','🐱‍💻','🐱‍🐉','🐱‍👓','🐱‍🚀',':monkey_face:',':dog:',':wolf:',':cat:',':lion_face:',':tiger:',':giraffe:',':fox:',':bear:',':rabbit:',':hamster:',':mouse:',':boar:',':pig:',':cow:',':raccoon:',':koala:',':panda_face:',':frog:',':zebra:',':horse:',':unicorn:',':chicken:',':dragon_face:',':poodle:',':service_dog:',':guide_dog:',':orangutan:',':gorilla:',':monkey:',':dog2:',':cat2:',':tiger2:',':leopard:',':racehorse:',':deer:',':rhino:',':hippopotamus:',':dromedary_camel:',':goat:',':sheep:',':ram:',':pig2:',':cow2:',':water_buffalo:',':ox:',':camel:',':llama:',':kangaroo:',':sloth:',':skunk:',':badger:',':elephant:',':mouse2:',':snake:',':turtle:',':crocodile:',':lizard:',':chipmunk:',':rabbit2:',':hedgehog:',':rat:',':dragon:',':sauropod:',':t_rex:',':otter:',':shark:',':dolphin:',':whale:',':duck:',':rooster:',':turkey:',':eagle:',':dove:',':swan:',':parrot:',':flamingo:',':peacock:',':owl:',':bird:',':penguin:',':baby_chick:',':hatching_chick:',':bat:', ':frame_photo:'];

export default function getRandomEmoji(): string {
    return emojis[Math.floor(Math.random() * emojis.length)];
}