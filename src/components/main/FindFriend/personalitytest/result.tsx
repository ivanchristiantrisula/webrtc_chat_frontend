import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import { useEffect, useRef } from "react";

const typeSummary = {
  INTJ: "Imaginative and strategic thinkers, with a plan for everything.",
  INTP: "Innovative inventors with an unquenchable thirst for knowledge.",
  ENTJ: "Bold, imaginative and strong-willed leaders, always finding a way – or making one.",
  ENTP: "Smart and curious thinkers who cannot resist an intellectual challenge.",
  INFJ: "Quiet and mystical, yet very inspiring and tireless idealists.",
  INFP: "Poetic, kind and altruistic people, always eager to help a good cause",
  ENFJ: "Charismatic and inspiring leaders, able to mesmerize their listeners.",
  ENFP: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
  ISTJ: "Practical and fact-minded individuals, whose reliability cannot be doubted.",
  ISFJ: "Very dedicated and warm protectors, always ready to defend their loved ones.",
  ESTJ: "Excellent administrators, unsurpassed at managing things – or people.",
  ESFJ: "Extraordinarily caring, social and popular people, always eager to help.",
  ISTP: "Bold and practical experimenters, masters of all kinds of tools.",
  ISFP: "Flexible and charming artists, always ready to explore and experience something new.",
  ESTP: "Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
  ESFP: "Spontaneous, energetic and enthusiastic people – life is never boring around them.",
};

const typeDescription = {
  INTJ: `As an INTJ, your primary mode of living is focused internally, where you take things in primarily via your intuition. Your secondary mode is external, where you deal with things rationally and logically.

INTJs live in the world of ideas and strategic planning. They value intelligence, knowledge, and competence, and typically have high standards in these regards, which they continuously strive to fulfill. To a somewhat lesser extent, they have similar expectations of others.

With Introverted Intuition dominating their personality, INTJs focus their energy on observing the world, and generating ideas and possibilities. Their mind constantly gathers information and makes associations about it. They are tremendously insightful and usually are very quick to understand new ideas. However, their primary interest is not understanding a concept, but rather applying that concept in a useful way. Unlike the INTP, they do not follow an idea as far as they possibly can, seeking only to understand it fully. INTJs are driven to come to conclusions about ideas. Their need for closure and organization usually requires that they take some action.

INTJ's tremendous value and need for systems and organization, combined with their natural insightfulness, makes them excellent scientists. An INTJ scientist gives a gift to society by putting their ideas into a useful form for others to follow. It is not easy for the INTJ to express their internal images, insights, and abstractions. The internal form of the INTJ's thoughts and concepts is highly individualized, and is not readily translatable into a form that others will understand. However, the INTJ is driven to translate their ideas into a plan or system that is usually readily explainable, rather than to do a direct translation of their thoughts. They usually don't see the value of a direct transaction, and will also have difficulty expressing their ideas, which are non-linear. However, their extreme respect of knowledge and intelligence will motivate them to explain themselves to another person who they feel is deserving of the effort.

INTJs are natural leaders, although they usually choose to remain in the background until they see a real need to take over the lead. When they are in leadership roles, they are quite effective, because they are able to objectively see the reality of a situation, and are adaptable enough to change things which aren't working well. They are the supreme strategists - always scanning available ideas and concepts and weighing them against their current strategy, to plan for every conceivable contingency.

INTJs spend a lot of time inside their own minds, and may have little interest in the other people's thoughts or feelings. Unless their Feeling side is developed, they may have problems giving other people the level of intimacy that is needed. Unless their Sensing side is developed, they may have a tendency to ignore details which are necessary for implementing their ideas.

The INTJ's interest in dealing with the world is to make decisions, express judgments, and put everything that they encounter into an understandable and rational system. Consequently, they are quick to express judgments. Often they have very evolved intuitions, and are convinced that they are right about things. Unless they complement their intuitive understanding with a well-developed ability to express their insights, they may find themselves frequently misunderstood. In these cases, INTJs tend to blame misunderstandings on the limitations of the other party, rather than on their own difficulty in expressing themselves. This tendency may cause the INTJ to dismiss others input too quickly, and to become generally arrogant and elitist.

INTJs are ambitious, self-confident, deliberate, long-range thinkers. Many INTJs end up in engineering or scientific pursuits, although some find enough challenge within the business world in areas which involve organizing and strategic planning. They dislike messiness and inefficiency, and anything that is muddled or unclear. They value clarity and efficiency, and will put enormous amounts of energy and time into consolidating their insights into structured patterns.

Other people may have a difficult time understanding an INTJ. They may see them as aloof and reserved. Indeed, the INTJ is not overly demonstrative of their affections, and is likely to not give as much praise or positive support as others may need or desire. That doesn't mean that he or she doesn't truly have affection or regard for others, they simply do not typically feel the need to express it. Others may falsely perceive the INTJ as being rigid and set in their ways. Nothing could be further from the truth, because the INTJ is committed to always finding the objective best strategy to implement their ideas. The INTJ is usually quite open to hearing an alternative way of doing something.

When under a great deal of stress, the INTJ may become obsessed with mindless repetitive, Sensate activities, such as over-drinking. They may also tend to become absorbed with minutia and details that they would not normally consider important to their overall goal.

INTJs need to remember to express themselves sufficiently, so as to avoid difficulties with people misunderstandings. In the absence of properly developing their communication abilities, they may become abrupt and short with people, and isolationists.

INTJs have a tremendous amount of ability to accomplish great things. They have insight into the Big Picture, and are driven to synthesize their concepts into solid plans of action. Their reasoning skills gives them the means to accomplish that. INTJs are most always highly competent people, and will not have a problem meeting their career or education goals. They have the capability to make great strides in these arenas. On a personal level, the INTJ who practices tolerances and puts effort into effectively communicating their insights to others has everything in his or her power to lead a rich and rewarding life.

`,
  INTP: `As an INTP, your primary mode of living is focused internally, where you deal with things rationally and logically. Your secondary mode is external, where you take things in primarily via your intuition.

INTPs live in the world of theoretical possibilities. They see everything in terms of how it could be improved, or what it could be turned into. They live primarily inside their own minds, having the ability to analyze difficult problems, identify patterns, and come up with logical explanations. They seek clarity in everything, and are therefore driven to build knowledge. They are the "absent-minded professors", who highly value intelligence and the ability to apply logic to theories to find solutions. They typically are so strongly driven to turn problems into logical explanations, that they live much of their lives within their own heads, and may not place as much importance or value on the external world. Their natural drive to turn theories into concrete understanding may turn into a feeling of personal responsibility to solve theoretical problems, and help society move towards a higher understanding.

INTPs value knowledge above all else. Their minds are constantly working to generate new theories, or to prove or disprove existing theories. They approach problems and theories with enthusiasm and skepticism, ignoring existing rules and opinions and defining their own approach to the resolution. They seek patterns and logical explanations for anything that interests them. They're usually extremely bright, and able to be objectively critical in their analysis. They love new ideas, and become very excited over abstractions and theories. They love to discuss these concepts with others. They may seem "dreamy" and distant to others, because they spend a lot of time inside their minds musing over theories. They hate to work on routine things - they would much prefer to build complex theoretical solutions, and leave the implementation of the system to others. They are intensely interested in theory, and will put forth tremendous amounts of time and energy into finding a solution to a problem with has piqued their interest.

INTPs do not like to lead or control people. They're very tolerant and flexible in most situations, unless one of their firmly held beliefs has been violated or challenged, in which case they may take a very rigid stance. The INTP is likely to be very shy when it comes to meeting new people. On the other hand, the INTP is very self-confident and gregarious around people they know well, or when discussing theories which they fully understand.

The INTP has no understanding or value for decisions made on the basis of personal subjectivity or feelings. They strive constantly to achieve logical conclusions to problems, and don't understand the importance or relevance of applying subjective emotional considerations to decisions. For this reason, INTPs are usually not in-tune with how people are feeling, and are not naturally well-equiped to meet the emotional needs of others.

The INTP may have a problem with self-aggrandizement and social rebellion, which will interfere with their creative potential. Since their Feeling side is their least developed trait, the INTP may have difficulty giving the warmth and support that is sometimes necessary in intimate relationships. If the INTP doesn't realize the value of attending to other people's feelings, he or she may become overly critical and sarcastic with others. If the INTP is not able to find a place for themself which supports the use of their strongest abilities, they may become generally negative and cynical. If the INTP has not developed their Sensing side sufficiently, they may become unaware of their environment, and exhibit weakness in performing maintenance-type tasks, such as bill-paying and dressing appropriately.

For the INTP, it is extremely important that ideas and facts are expressed correctly and succinctly. They are likely to express themselves in what they believe to be absolute truths. Sometimes, their well thought-out understanding of an idea is not easily understandable by others, but the INTP is not naturally likely to tailor the truth so as to explain it in an understandable way to others. The INTP may be prone to abandoning a project once they have figured it out, moving on to the next thing. It's important that the INTP place importance on expressing their developed theories in understandable ways. In the end, an amazing discovery means nothing if you are the only person who understands it.

The INTP is usually very independent, unconventional, and original. They are not likely to place much value on traditional goals such as popularity and security. They usually have complex characters, and may tend to be restless and temperamental. They are strongly ingenious, and have unconventional thought patterns which allows them to analyze ideas in new ways. Consequently, a lot of scientific breakthroughs in the world have been made by the INTP.

The INTP is at his best when he can work on his theories independently. When given an environment which supports his creative genius and possible eccentricity, the INTP can accomplish truly remarkable things. These are the pioneers of new thoughts in our society.`,
  ENTJ: `As an ENTJ, your primary mode of living is focused externally, where you deal with things rationally and logically. Your secondary mode is internal, where you take things in primarily via your intuition.

ENTJs are natural born leaders. They live in a world of possibilities where they see all sorts challenges to be surmounted, and they want to be the ones responsible for surmounting them. They have a drive for leadership, which is well-served by their quickness to grasp complexities, their ability to absorb a large amount of impersonal information, and their quick and decisive judgments. They are "take charge" people.

ENTJs are very career-focused, and fit into the corporate world quite naturally. They are constantly scanning their environment for potential problems which they can turn into solutions. They generally see things from a long-range perspective, and are usually successful at identifying plans to turn problems around - especially problems of a corporate nature. ENTJs are usually successful in the business world, because they are so driven to leadership. They're tireless in their efforts on the job, and driven to visualize where an organization is headed. For these reasons, they are natural corporate leaders.

There is not much room for error in the world of the ENTJ. They dislike to see mistakes repeated, and have no patience with inefficiency. They may become quite harsh when their patience is tried in these respects, because they are not naturally tuned in to people's feelings, and more than likely don't believe that they should tailor their judgments in consideration for people's feelings. ENTJs, like many types, have difficulty seeing things from outside their own perspective. Unlike other types, ENTJs naturally have little patience with people who do not see things the same way as the ENTJ. The ENTJ needs to consciously work on recognizing the value of other people's opinions, as well as the value of being sensitive towards people's feelings. In the absence of this awareness, the ENTJ will be a forceful, intimidating and overbearing individual. This may be a real problem for the ENTJ, who may be deprived of important information and collaboration from others. In their personal world, it can make some ENTJs overbearing as spouses or parents.

The ENTJ has a tremendous amount of personal power and presence which will work for them as a force towards achieving their goals. However, this personal power is also an agent of alienation and self-aggrandizement, which the ENTJ would do well to avoid.

ENTJs are very forceful, decisive individuals. They make decisions quickly, and are quick to verbalize their opinions and decisions to the rest of the world. The ENTJ who has not developed their Intuition will make decisions too hastily, without understanding all of the issues and possible solutions. On the other hand, an ENTJ who has not developed their Thinking side will have difficulty applying logic to their insights, and will often make poor decisions. In that case, they may have brilliant ideas and insight into situations, but they may have little skill at determining how to act upon their understanding, or their actions may be inconsistent. An ENTJ who has developed in a generally less than ideal way may become dictatorial and abrasive - intrusively giving orders and direction without a sound reason for doing so, and without consideration for the people involved.

Although ENTJs are not naturally tuned into other people's feelings, these individuals frequently have very strong sentimental streaks. Often these sentiments are very powerful to the ENTJ, although they will likely hide it from general knowledge, believing the feelings to be a weakness. Because the world of feelings and values is not where the ENTJ naturally functions, they may sometimes make value judgments and hold onto submerged emotions which are ill-founded and inappropriate, and will cause them problems - sometimes rather serious problems.

ENTJs love to interact with people. As Extroverts, they're energized and stimulated primarily externally. There's nothing more enjoyable and satisfying to the ENTJ than having a lively, challenging conversation. They especially respect people who are able to stand up to the ENTJ, and argue persuasively for their point of view. There aren't too many people who will do so, however, because the ENTJ is a very forceful and dynamic presence who has a tremendous amount of self-confidence and excellent verbal communication skills. Even the most confident individuals may experience moments of self-doubt when debating a point with an ENTJ.

ENTJs want their home to be beautiful, well-furnished, and efficiently run. They're likely to place much emphasis on their children being well-educated and structured, to desire a congenial and devoted relationship with their spouse. At home, the ENTJ needs to be in charge as much as he or she does in their career. The ENTJ is likely best paired with someone who has a strong self-image, who is also a Thinking type. Because the ENTJ is primarily focused on their careers, some ENTJs have a problem with being constantly absent from home, physically or mentally.

The ENTJ has many gifts which make it possible for them to have a great deal of personal power, if they don't forget to remain balanced in their lives. They are assertive, innovative, long-range thinkers with an excellent ability to translate theories and possibilities into solid plans of action. They are usually tremendously forceful personalities, and have the tools to accomplish whatever goals they set out for.`,
  ENTP: `As an ENTP, your primary mode of living is focused externally, where you take things in primarily via your intuition. Your secondary mode is internal, where you deal with things rationally and logically.

With Extraverted Intuition dominating their personality, the ENTP's primary interest in life is understanding the world that they live in. They are constantly absorbing ideas and images about the situations they are presented in their lives. Using their intuition to process this information, they are usually extremely quick and accurate in their ability to size up a situation. With the exception of their ENFP cousin, the ENTP has a deeper understanding of their environment than any of the other types.

This ability to intuitively understand people and situations puts the ENTP at a distinct advantage in their lives. They generally understand things quickly and with great depth. Accordingly, they are quite flexible and adapt well to a wide range of tasks. They are good at most anything that interests them. As they grow and further develop their intuitive abilities and insights, they become very aware of possibilities, and this makes them quite resourceful when solving problems.

ENTPs are idea people. Their perceptive abilities cause them to see possibilities everywhere. They get excited and enthusiastic about their ideas, and are able to spread their enthusiasm to others. In this way, they get the support that they need to fulfill their visions.

ENTPs are less interested in developing plans of actions or making decisions than they are in generating possibilities and ideas. Following through on the implementation of an idea is usually a chore to the ENTP. For some ENTPs, this results in the habit of never finishing what they start. The ENTP who has not developed their Thinking process will have problems with jumping enthusiastically from idea to idea, without following through on their plans. The ENTP needs to take care to think through their ideas fully in order to take advantage of them.

The ENTP's auxiliary process of Introverted Thinking drives their decision making process. Although the ENTP is more interested in absorbing information than in making decisions, they are quite rational and logical in reaching conclusions. When they apply Thinking to their Intuitive perceptions, the outcome can be very powerful indeed. A well-developed ENTP is extremely visionary, inventive, and enterprising.

ENTPs are fluent conversationalists, mentally quick, and enjoy verbal sparring with others. They love to debate issues, and may even switch sides sometimes just for the love of the debate. When they express their underlying principles, however, they may feel awkward and speak abruptly and intensely.

The ENTP personality type is sometimes referred to the "Lawyer" type. The ENTP "lawyer" quickly and accurately understands a situation, and objectively and logically acts upon the situation. Their Thinking side makes their actions and decisions based on an objective list of rules or laws. If the ENTP was defending someone who had actually committed a crime, they are likely to take advantage of quirks in the law that will get their client off the hook. If they were to actually win the case, they would see their actions as completely fair and proper to the situation, because their actions were lawful. The guilt or innocence of their client would not be as relevant. If this type of reasoning goes uncompletely unchecked by the ENTP, it could result in a character that is perceived by others as unethical or even dishonest. The ENTP, who does not naturally consider the more personal or human element in decision making, should take care to notice the subjective, personal side of situations. This is a potential problem are for ENTPs. Although their logical abilities lend strength and purpose to the ENTP, they may also isolate them from their feelings and from other people.

The least developed area for the ENTP is the Sensing-Feeling arena. If the Sensing areas are neglected, the ENTP may tend to not take care of details in their life. If the Feeling part of themself is neglected, the ENTP may not value other people's input enough, or may become overly harsh and aggressive.

Under stress, the ENTP may lose their ability to generate possibilities, and become obsessed with minor details. These details may seem to be extremely important to the ENTP, but in reality are usually not important to the big picture.

In general, ENTPs are upbeat visionaries. They highly value knowledge, and spend much of their lives seeking a higher understanding. They live in the world of possibilities, and become excited about concepts, challenges and difficulties. When presented with a problem, they're good at improvising and quickly come up with a creative solution. Creative, clever, curious, and theoretical, ENTPs have a broad range of possibilities in their lives.`,
  ENFJ: `As an ENFJ, you're primary mode of living is focused externally, where you deal with things according to how you feel about them, or how they fit into your personal value system. Your secondary mode is internal, where you take things in primarily via your intuition.

ENFJs are people-focused individuals. They live in the world of people possibilities. More so than any other type, they have excellent people skills. They understand and care about people, and have a special talent for bringing out the best in others. ENFJ's main interest in life is giving love, support, and a good time to other people. They are focused on understanding, supporting, and encouraging others. They make things happen for people, and get their best personal satisfaction from this.

Because ENFJ's people skills are so extraordinary, they have the ability to make people do exactly what they want them to do. They get under people's skins and get the reactions that they are seeking. ENFJ's motives are usually unselfish, but ENFJs who have developed less than ideally have been known to use their power over people to manipulate them.

ENFJ's are so externally focused that it's especially important for them to spend time alone. This can be difficult for some ENFJs, because they have the tendency to be hard on themselves and turn to dark thoughts when alone. Consequently, ENFJs might avoid being alone, and fill their lives with activities involving other people. ENFJs tend to define their life's direction and priorities according to other people's needs, and may not be aware of their own needs. It's natural to their personality type that they will tend to place other people's needs above their own, but they need to stay aware of their own needs so that they don't sacrifice themselves in their drive to help others.

ENFJ's tend to be more reserved about exposing themselves than other extraverted types. Although they may have strongly-felt beliefs, they're likely to refrain from expressing them if doing so would interfere with bringing out the best in others. Because their strongest interest lies in being a catalyst of change in other people, they're likely to interact with others on their own level, in a chameleon-like manner, rather than as individuals.

Which is not to say that the ENFJ does not have opinions. ENFJs have definite values and opinions which they're able to express clearly and succinctly. These beliefs will be expressed as long as they're not too personal. ENFJ is in many ways expressive and open, but is more focused on being responsive and supportive of others. When faced with a conflict between a strongly-held value and serving another person's need, they are highly likely to value the other person's needs.

The ENFJ may feel quite lonely even when surrounded by people. This feeling of aloneness may be exacerbated by the tendency to not reveal their true selves.

People love ENFJs. They are fun to be with, and truly understand and love people. They are typically very straight-forward and honest. Usually ENFJs exude a lot of self-confidence, and have a great amount of ability to do many different things. They are generally bright, full of potential, energetic and fast-paced. They are usually good at anything which captures their interest.

ENFJs like for things to be well-organized, and will work hard at maintaining structure and resolving ambiguity. They have a tendency to be fussy, especially with their home environments.

In the work place, ENFJs do well in positions where they deal with people. They are naturals for the social committee. Their uncanny ability to understand people and say just what needs to be said to make them happy makes them naturals for counseling. They enjoy being the center of attention, and do very well in situations where they can inspire and lead others, such as teaching.

ENFJs do not like dealing with impersonal reasoning. They don't understand or appreciate its merit, and will be unhappy in situations where they're forced to deal with logic and facts without any connection to a human element. Living in the world of people possibilities, they enjoy their plans more than their achievements. They get excited about possibilities for the future, but may become easily bored and restless with the present.

ENFJs have a special gift with people, and are basically happy people when they can use that gift to help others. They get their best satisfaction from serving others. Their genuine interest in Humankind and their exceptional intuitive awareness of people makes them able to draw out even the most reserved individuals.

ENFJs have a strong need for close, intimate relationships, and will put forth a lot of effort in creating and maintaining these relationships. They're very loyal and trustworthy once involved in a relationship.

An ENFJ who has not developed their Feeling side may have difficulty making good decisions, and may rely heavily on other people in decision-making processes. If they have not developed their Intuition, they may not be able to see possibilities, and will judge things too quickly based on established value systems or social rules, without really understanding the current situation. An ENFJ who has not found their place in the world is likely to be extremely sensitive to criticism, and to have the tendency to worry excessively and feel guilty. They are also likely to be very manipulative and controling with others.

In general, ENFJs are charming, warm, gracious, creative and diverse individuals with richly developed insights into what makes other people tick. This special ability to see growth potential in others combined with a genuine drive to help people makes the ENFJ a truly valued individual. As giving and caring as the ENFJ is, they need to remember to value their own needs as well as the needs of others.`,
  INFP: `As an INFP, your primary mode of living is focused internally, where you deal with things according to how you feel about them, or how they fit into your personal value system. Your secondary mode is external, where you take things in primarily via your intuition.

INFPs, more than other iNtuitive Feeling types, are focused on making the world a better place for people. Their primary goal is to find out their meaning in life. What is their purpose? How can they best serve humanity in their lives? They are idealists and perfectionists, who drive themselves hard in their quest for achieving the goals they have identified for themselves

INFPs are highly intuitive about people. They rely heavily on their intuitions to guide them, and use their discoveries to constantly search for value in life. They are on a continuous mission to find the truth and meaning underlying things. Every encounter and every piece of knowledge gained gets sifted through the INFP's value system, and is evaluated to see if it has any potential to help the INFP define or refine their own path in life. The goal at the end of the path is always the same - the INFP is driven to help people and make the world a better place.

Generally thoughtful and considerate, INFPs are good listeners and put people at ease. Although they may be reserved in expressing emotion, they have a very deep well of caring and are genuinely interested in understanding people. This sincerity is sensed by others, making the INFP a valued friend and confidante. An INFP can be quite warm with people he or she knows well.

INFPs do not like conflict, and go to great lengths to avoid it. If they must face it, they will always approach it from the perspective of their feelings. In conflict situations, INFPs place little importance on who is right and who is wrong. They focus on the way that the conflict makes them feel, and indeed don't really care whether or not they're right. They don't want to feel badly. This trait sometimes makes them appear irrational and illogical in conflict situations. On the other hand, INFPs make very good mediators, and are typically good at solving other people's conflicts, because they intuitively understand people's perspectives and feelings, and genuinely want to help them.

INFPs are flexible and laid-back, until one of their values is violated. In the face of their value system being threatened, INFPs can become aggressive defenders, fighting passionately for their cause. When an INFP has adopted a project or job which they're interested in, it usually becomes a "cause" for them. Although they are not detail-oriented individuals, they will cover every possible detail with determination and vigor when working for their "cause".

When it comes to the mundane details of life maintenance, INFPs are typically completely unaware of such things. They might go for long periods without noticing a stain on the carpet, but carefully and meticulously brush a speck of dust off of their project booklet.

INFPs do not like to deal with hard facts and logic. Their focus on their feelings and the Human Condition makes it difficult for them to deal with impersonal judgment. They don't understand or believe in the validity of impersonal judgment, which makes them naturally rather ineffective at using it. Most INFPs will avoid impersonal analysis, although some have developed this ability and are able to be quite logical. Under stress, it's not uncommon for INFPs to mis-use hard logic in the heat of anger, throwing out fact after (often inaccurate) fact in an emotional outburst.

INFPs have very high standards and are perfectionists. Consequently, they are usually hard on themselves, and don't give themselves enough credit. INFPs may have problems working on a project in a group, because their standards are likely to be higher than other members' of the group. In group situations, they may have a "control" problem. The INFP needs to work on balancing their high ideals with the requirements of every day living. Without resolving this conflict, they will never be happy with themselves, and they may become confused and paralyzed about what to do with their lives.

INFPs are usually talented writers. They may be awkard and uncomfortable with expressing themselves verbally, but have a wonderful ability to define and express what they're feeling on paper. INFPs also appear frequently in social service professions, such as counselling or teaching. They are at their best in situations where they're working towards the public good, and in which they don't need to use hard logic.

INFPs who function in their well-developed sides can accomplish great and wonderful things, which they will rarely give themselves credit for. Some of the great, humanistic catalysts in the world have been INFPs.`,
  INFJ: `As an INFJ, your primary mode of living is focused internally, where you take things in primarily via intuition. Your secondary mode is external, where you deal with things according to how you feel about them, or how they fit with your personal value system.

INFJs are gentle, caring, complex and highly intuitive individuals. Artistic and creative, they live in a world of hidden meanings and possibilities. Only one percent of the population has an INFJ Personality Type, making it the most rare of all the types.

INFJs place great importance on havings things orderly and systematic in their outer world. They put a lot of energy into identifying the best system for getting things done, and constantly define and re-define the priorities in their lives. On the other hand, INFJs operate within themselves on an intuitive basis which is entirely spontaneous. They know things intuitively, without being able to pinpoint why, and without detailed knowledge of the subject at hand. They are usually right, and they usually know it. Consequently, INFJs put a tremendous amount of faith into their instincts and intuitions. This is something of a conflict between the inner and outer worlds, and may result in the INFJ not being as organized as other Judging types tend to be. Or we may see some signs of disarray in an otherwise orderly tendency, such as a consistently messy desk.

INFJs have uncanny insight into people and situations. They get "feelings" about things and intuitively understand them. As an extreme example, some INFJs report experiences of a psychic nature, such as getting strong feelings about there being a problem with a loved one, and discovering later that they were in a car accident. This is the sort of thing that other types may scorn and scoff at, and the INFJ themself does not really understand their intuition at a level which can be verbalized. Consequently, most INFJs are protective of their inner selves, sharing only what they choose to share when they choose to share it. They are deep, complex individuals, who are quite private and typically difficult to understand. INFJs hold back part of themselves, and can be secretive.

But the INFJ is as genuinely warm as they are complex. INFJs hold a special place in the heart of people who they are close to, who are able to see their special gifts and depth of caring. INFJs are concerned for people's feelings, and try to be gentle to avoid hurting anyone. They are very sensitive to conflict, and cannot tolerate it very well. Situations which are charged with conflict may drive the normally peaceful INFJ into a state of agitation or charged anger. They may tend to internalize conflict into their bodies, and experience health problems when under a lot of stress.

Because the INFJ has such strong intuitive capabilities, they trust their own instincts above all else. This may result in an INFJ stubborness and tendency to ignore other people's opinions. They believe that they're right. On the other hand, INFJ is a perfectionist who doubts that they are living up to their full potential. INFJs are rarely at complete peace with themselves - there's always something else they should be doing to improve themselves and the world around them. They believe in constant growth, and don't often take time to revel in their accomplishments. They have strong value systems, and need to live their lives in accordance with what they feel is right. In deference to the Feeling aspect of their personalities, INFJs are in some ways gentle and easy going. Conversely, they have very high expectations of themselves, and frequently of their families. They don't believe in compromising their ideals.

INFJ is a natural nurturer; patient, devoted and protective. They make loving parents and usually have strong bonds with their offspring. They have high expectations of their children, and push them to be the best that they can be. This can sometimes manifest itself in the INFJ being hard-nosed and stubborn. But generally, children of an INFJ get devoted and sincere parental guidance, combined with deep caring.

In the workplace, the INFJ usually shows up in areas where they can be creative and somewhat independent. They have a natural affinity for art, and many excel in the sciences, where they make use of their intuition. INFJs can also be found in service-oriented professions. They are not good at dealing with minutia or very detailed tasks. The INFJ will either avoid such things, or else go to the other extreme and become enveloped in the details to the extent that they can no longer see the big picture. An INFJ who has gone the route of becoming meticulous about details may be highly critical of other individuals who are not.

The INFJ individual is gifted in ways that other types are not. Life is not necessarily easy for the INFJ, but they are capable of great depth of feeling and personal achievement.`,
  ENFP: `As an ENFP, your primary mode of living is focused externally, where you take things in primarily via your intuition. Your secondary mode is internal, where you deal with things according to how you feel about them, or how they fit in with your personal value system.

ENFPs are warm, enthusiastic people, typically very bright and full of potential. They live in the world of possibilities, and can become very passionate and excited about things. Their enthusiasm lends them the ability to inspire and motivate others, more so than we see in other types. They can talk their way in or out of anything. They love life, seeing it as a special gift, and strive to make the most out of it.

ENFPs have an unusually broad range of skills and talents. They are good at most things which interest them. Project-oriented, they may go through several different careers during their lifetime. To onlookers, the ENFP may seem directionless and without purpose, but ENFPs are actually quite consistent, in that they have a strong sense of values which they live with throughout their lives. Everything that they do must be in line with their values. An ENFP needs to feel that they are living their lives as their true Self, walking in step with what they believe is right. They see meaning in everything, and are on a continuous quest to adapt their lives and values to achieve inner peace. They're constantly aware and somewhat fearful of losing touch with themselves. Since emotional excitement is usually an important part of the ENFP's life, and because they are focused on keeping "centered", the ENFP is usually an intense individual, with highly evolved values.

An ENFP needs to focus on following through with their projects. This can be a problem area for some of these individuals. Unlike other Extraverted types, ENFPs need time alone to center themselves, and make sure they are moving in a direction which is in sync with their values. ENFPs who remain centered will usually be quite successful at their endeavors. Others may fall into the habit of dropping a project when they become excited about a new possibility, and thus they never achieve the great accomplishments which they are capable of achieving.

Most ENFPs have great people skills. They are genuinely warm and interested in people, and place great importance on their inter-personal relationships. ENFPs almost always have a strong need to be liked. Sometimes, especially at a younger age, an ENFP will tend to be "gushy" and insincere, and generally "overdo" in an effort to win acceptance. However, once an ENFP has learned to balance their need to be true to themselves with their need for acceptance, they excel at bringing out the best in others, and are typically well-liked. They have an exceptional ability to intuitively understand a person after a very short period of time, and use their intuition and flexibility to relate to others on their own level.

Because ENFPs live in the world of exciting possibilities, the details of everyday life are seen as trivial drudgery. They place no importance on detailed, maintenance-type tasks, and will frequently remain oblivous to these types of concerns. When they do have to perform these tasks, they do not enjoy themselves. This is a challenging area of life for most ENFPs, and can be frustrating for ENFP's family members.

An ENFP who has "gone wrong" may be quite manipulative - and very good it. The gift of gab which they are blessed with makes it naturally easy for them to get what they want. Most ENFPs will not abuse their abilities, because that would not jive with their value systems.

ENFPs sometimes make serious errors in judgment. They have an amazing ability to intuitively perceive the truth about a person or situation, but when they apply judgment to their perception, they may jump to the wrong conclusions.

ENFPs who have not learned to follow through may have a difficult time remaining happy in marital relationships. Always seeing the possibilities of what could be, they may become bored with what actually is. The strong sense of values will keep many ENFPs dedicated to their relationships. However, ENFPs like a little excitement in their lives, and are best matched with individuals who are comfortable with change and new experiences.

Having an ENFP parent can be a fun-filled experience, but may be stressful at times for children with strong Sensing or Judging tendancies. Such children may see the ENFP parent as inconsistent and difficult to understand, as the children are pulled along in the whirlwind life of the ENFP. Sometimes the ENFP will want to be their child's best friend, and at other times they will play the parental authoritarian. But ENFPs are always consistent in their value systems, which they will impress on their children above all else, along with a basic joy of living.

ENFPs are basically happy people. They may become unhappy when they are confined to strict schedules or mundane tasks. Consequently, ENFPs work best in situations where they have a lot of flexibility, and where they can work with people and ideas. Many go into business for themselves. They have the ability to be quite productive with little supervision, as long as they are excited about what they're doing.

Because they are so alert and sensitive, constantly scanning their environments, ENFPs often suffer from muscle tension. They have a strong need to be independent, and resist being controlled or labelled. They need to maintain control over themselves, but they do not believe in controlling others. Their dislike of dependence and suppression extends to others as well as to themselves.

ENFPs are charming, ingenuous, risk-taking, sensitive, people-oriented individuals with capabilities ranging across a broad spectrum. They have many gifts which they will use to fulfill themselves and those near them, if they are able to remain centered and master the ability of following through.`,
  ISTJ: `As an ISTJ, your primary mode of living is focused internally, where you take things in via your five senses in a literal, concrete fashion. Your secondary mode is external, where you deal with things rationally and logically.

ISTJs are quiet and reserved individuals who are interested in security and peaceful living. They have a strongly-felt internal sense of duty, which lends them a serious air and the motivation to follow through on tasks. Organized and methodical in their approach, they can generally succeed at any task which they undertake.

ISTJs are very loyal, faithful, and dependable. They place great importance on honesty and integrity. They are "good citizens" who can be depended on to do the right thing for their families and communities. While they generally take things very seriously, they also usually have an offbeat sense of humor and can be a lot of fun - especially at family or work-related gatherings.

ISTJs tend to believe in laws and traditions, and expect the same from others. They're not comfortable with breaking laws or going against the rules. If they are able to see a good reason for stepping outside of the established mode of doing things, the ISTJ will support that effort. However, ISTJs more often tend to believe that things should be done according to procedures and plans. If an ISTJ has not developed their Intuitive side sufficiently, they may become overly obsessed with structure, and insist on doing everything "by the book".

The ISTJ is extremely dependable on following through with things which he or she has promised. For this reason, they sometimes get more and more work piled on them. Because the ISTJ has such a strong sense of duty, they may have a difficult time saying "no" when they are given more work than they can reasonably handle. For this reason, the ISTJ often works long hours, and may be unwittingly taken advantage of.

The ISTJ will work for long periods of time and put tremendous amounts of energy into doing any task which they see as important to fulfilling a goal. However, they will resist putting energy into things which don't make sense to them, or for which they can't see a practical application. They prefer to work alone, but work well in teams when the situation demands it. They like to be accountable for their actions, and enjoy being in positions of authority. The ISTJ has little use for theory or abstract thinking, unless the practical application is clear.

ISTJs have tremendous respect for facts. They hold a tremendous store of facts within themselves, which they have gathered through their Sensing preference. They may have difficulty understanding a theory or idea which is different from their own perspective. However, if they are shown the importance or relevance of the idea to someone who they respect or care about, the idea becomes a fact, which the ISTJ will internalize and support. Once the ISTJ supports a cause or idea, he or she will stop at no lengths to ensure that they are doing their duty of giving support where support is needed.

The ISTJ is not naturally in tune with their own feelings and the feelings of others. They may have difficulty picking up on emotional needs immediately, as they are presented. Being perfectionists themselves, they have a tendency to take other people's efforts for granted, like they take their own efforts for granted. They need to remember to pat people on the back once in a while.

ISTJs are likely to be uncomfortable expressing affection and emotion to others. However, their strong sense of duty and the ability to see what needs to be done in any situation usually allows them to overcome their natural reservations, and they are usually quite supporting and caring individuals with the people that they love. Once the ISTJ realizes the emotional needs of those who are close to them, they put forth effort to meet those needs.

The ISTJ is extremely faithful and loyal. Traditional and family-minded, they will put forth great amounts of effort at making their homes and families running smoothly. They are responsible parents, taking their parenting roles seriously. They are usually good and generous providers to their families. They care deeply about those close to them, although they usually are not comfortable with expressing their love. The ISTJ is likely to express their affection through actions, rather than through words.

ISTJs have an excellent ability to take any task and define it, organize it, plan it, and implement it through to completion. They are very hard workers, who do not allow obstacles to get in the way of performing their duties. They do not usually give themselves enough credit for their achievements, seeing their accomplishments simply as the natural fulfillment of their obligations.

ISTJs usually have a great sense of space and function, and artistic appreciation. Their homes are likely to be tastefully furnished and immaculately maintained. They are acutely aware of their senses, and want to be in surroundings which fit their need for structure, order, and beauty.

Under stress, ISTJs may fall into "catastrophe mode", where they see nothing but all of the possibilities of what could go wrong. They will berate themselves for things which they should have done differently, or duties which they failed to perform. They will lose their ability to see things calmly and reasonably, and will depress themselves with their visions of doom.

In general, the ISTJ has a tremendous amount of potential. Capable, logical, reasonable, and effective individuals with a deeply driven desire to promote security and peaceful living, the ISTJ has what it takes to be highly effective at achieving their chosen goals - whatever they may be.`,
  ISFJ: `As an ISFJ, your primary mode of living is focused internally, where you takes things in via your five senses in a literal, concrete fashion. Your secondary mode is external, where you deal with things according to how you feel about them, or how they fit into your personal value system.

ISFJs live in a world that is concrete and kind. They are truly warm and kind-hearted, and want to believe the best of people. They value harmony and cooperation, and are likely to be very sensitive to other people's feelings. People value the ISFJ for their consideration and awareness, and their ability to bring out the best in others by their firm desire to believe the best.

ISFJs have a rich inner world that is not usually obvious to observers. They constantly take in information about people and situations that is personally important to them, and store it away. This tremendous store of information is usually startlingly accurate, because the ISFJ has an exceptional memory about things that are important to their value systems. It would not be uncommon for the ISFJ to remember a particular facial expression or conversation in precise detail years after the event occured, if the situation made an impression on the ISFJ.

ISFJs have a very clear idea of the way things should be, which they strive to attain. They value security and kindness, and respect traditions and laws. They tend to believe that existing systems are there because they work. Therefore, they're not likely to buy into doing things in a new way, unless they're shown in a concrete way why its better than the established method.

ISFJs learn best by doing, rather than by reading about something in a book, or applying theory. For this reason, they are not likely to be found in fields which require a lot of conceptual analysis or theory. They value practical application. Traditional methods of higher education, which require a lot of theorizing and abstraction, are likely to be a chore for the ISFJ. The ISFJ learns a task best by being shown its practical application. Once the task is learned, and its practical importance is understood, the ISFJ will faithfully and tirelessly carry through the task to completion. The ISFJ is extremely dependable.

The ISFJ has an extremely well-developed sense of space, function, and aesthetic appeal. For that reason, they're likely to have beautifully furnished, functional homes. They make extremely good interior decorators. This special ability, combined with their sensitivity to other's feelings and desires, makes them very likely to be great gift-givers - finding the right gift which will be truly appreciated by the recipient.

More so than other types, ISFJs are extremely aware of their own internal feelings, as well as other people's feelings. They do not usually express their own feelings, keeping things inside. If they are negative feelings, they may build up inside the ISFJ until they turn into firm judgments against individuals which are difficult to unseed, once set. Many ISFJs learn to express themselves, and find outlets for their powerful emotions.

Just as the ISFJ is not likely to express their feelings, they are also not likely to let on that they know how others are feeling. However, they will speak up when they feel another individual really needs help, and in such cases they can truly help others become aware of their feelings.

The ISFJ feels a strong sense of responsibility and duty. They take their responsibilities very seriously, and can be counted on to follow through. For this reason, people naturally tend to rely on them. The ISFJ has a difficult time saying "no" when asked to do something, and may become over-burdened. In such cases, the ISFJ does not usually express their difficulties to others, because they intensely dislike conflict, and because they tend to place other people's needs over their own. The ISFJ needs to learn to identify, value, and express their own needs, if they wish to avoid becoming over-worked and taken for granted.

ISFJs need positive feedback from others. In the absence of positive feedback, or in the face of criticism, the ISFJ gets discouraged, and may even become depressed. When down on themselves or under great stress, the ISFJ begins to imagine all of the things that might go critically wrong in their life. They have strong feelings of inadequacy, and become convinced that "everything is all wrong", or "I can't do anything right".

The ISFJ is warm, generous, and dependable. They have many special gifts to offer, in their sensitivity to others, and their strong ability to keep things running smoothly. They need to remember to not be overly critical of themselves, and to give themselves some of the warmth and love which they freely dispense to others.`,
  ESTJ: `As an ESTJ, your primary mode of living is focused externally, where you deal with things rationally and logically. Your secondary mode is internal, where you take things in via your five senses in a literal, concrete fashion.

ESTJs live in a world of facts and concrete needs. They live in the present, with their eye constantly scanning their personal environment to make sure that everything is running smoothly and systematically. They honor traditions and laws, and have a clear set of standards and beliefs. They expect the same of others, and have no patience or understanding of individuals who do not value these systems. They value competence and efficiency, and like to see quick results for their efforts.

ESTJs are take-charge people. They have such a clear vision of the way that things should be, that they naturally step into leadership roles. They are self-confident and aggressive. They are extremely talented at devising systems and plans for action, and at being able to see what steps need to be taken to complete a specific task. They can sometimes be very demanding and critical, because they have such strongly held beliefs, and are likely to express themselves without reserve if they feel someone isn't meeting their standards. But at least their expressions can be taken at face-value, because the ESTJ is extremely straight-forward and honest.

The ESTJ is usually a model citizen, and pillar of the community. He or she takes their commitments seriously, and follows their own standards of "good citizenship" to the letter. ESTJ enjoys interacting with people, and likes to have fun. ESTJs can be very boisterous and fun at social events, especially activities which are focused on the family, community, or work.

The ESTJ needs to watch out for the tendency to be too rigid, and to become overly detail-oriented. Since they put a lot of weight in their own beliefs, it's important that they remember to value other people's input and opinions. If they neglect their Feeling side, they may have a problem with fulfilling other's needs for intimacy, and may unknowingly hurt people's feelings by applying logic and reason to situations which demand more emotional sensitivity.

When bogged down by stress, an ESTJ often feels isolated from others. They feel as if they are misunderstood and undervalued, and that their efforts are taken for granted. Although normally the ESTJ is very verbal and doesn't have any problem expressing themself, when under stress they have a hard time putting their feelings into words and communicating them to others.

ESTJs value security and social order above all else, and feel obligated to do all that they can to enhance and promote these goals. They will mow the lawn, vote, join the PTA, attend home owners association meetings, and generally do anything that they can to promote personal and social security.

The ESTJ puts forth a lot of effort in almost everything that they do. They will do everything that they think should be done in their job, marriage, and community with a good amount of energy. He or she is conscientious, practical, realistic, and dependable. While the ESTJ will dutifully do everything that is important to work towards a particular cause or goal, they might not naturally see or value the importance of goals which are outside of their practical scope. However, if the ESTJ is able to see the relevance of such goals to practical concerns, you can bet that they'll put every effort into understanding them and incorporating them into their quest for clarity and security.`,
  ESFJ: `As an ESFJ, your primary mode of living is focused externally, where you deal with things according to how you feel about them, or how they fit in with your personal value system. Your secondary mode is internal, where you take things in via your five senses in a literal, concrete fashion.

ESFJs are people persons - they love people. They are warmly interested in others. They use their Sensing and Judging characteristics to gather specific, detailed information about others, and turn this information into supportive judgments. They want to like people, and have a special skill at bringing out the best in others. They are extremely good at reading others, and understanding their point of view. The ESFJ's strong desire to be liked and for everything to be pleasant makes them highly supportive of others. People like to be around ESFJs, because the ESFJ has a special gift of invariably making people feel good about themselves.

The ESFJ takes their responsibilities very seriously, and is very dependable. They value security and stability, and have a strong focus on the details of life. They see before others do what needs to be done, and do whatever it takes to make sure that it gets done. They enjoy these types of tasks, and are extremely good at them.

ESFJs are warm and energetic. They need approval from others to feel good about themselves. They are hurt by indifference and don't understand unkindness. They are very giving people, who get a lot of their personal satisfaction from the happiness of others. They want to be appreciated for who they are, and what they give. They're very sensitive to others, and freely give practical care. ESFJs are such caring individuals, that they sometimes have a hard time seeing or accepting a difficult truth about someone they care about.

With Extraverted Feeling dominating their personality, ESFJs are focused on reading other people. They have a strong need to be liked, and to be in control. They are extremely good at reading others, and often change their own manner to be more pleasing to whoever they're with at the moment.

The ESFJ's value system is defined externally. They usually have very well-formed ideas about the way things should be, and are not shy about expressing these opinions. However, they weigh their values and morals against the world around them, rather than against an internal value system. They may have a strong moral code, but it is defined by the community that they live in, rather than by any strongly felt internal values.

ESFJs who have had the benefit of being raised and surrounded by a strong value system that is ethical and centered around genuine goodness will most likely be the kindest, most generous souls who will gladly give you the shirt off of their back without a second thought. For these individuals, the selfless quality of their personality type is genuine and pure. ESFJs who have not had the advantage of developing their own values by weighing them against a good external value system may develop very questionable values. In such cases, the ESFJ most often genuinely believes in the integrity of their skewed value system. They have no internal understanding of values to set them straight. In weighing their values against our society, they find plenty of support for whatever moral transgression they wish to justify. This type of ESFJ is a dangerous person indeed. Extraverted Feeling drives them to control and manipulate, and their lack of Intuition prevents them from seeing the big picture. They're usually quite popular and good with people, and good at manipulating them. Unlike their ENFJ cousin, they don't have Intuition to help them understand the real consequences of their actions. They are driven to manipulate other to achieve their own ends, yet they believe that they are following a solid moral code of conduct.

All ESFJs have a natural tendency to want to control their environment. Their dominant function demands structure and organization, and seeks closure. ESFJs are most comfortable with structured environments. They're not likely to enjoy having to do things which involve abstract, theoretical concepts, or impersonal analysis. They do enjoy creating order and structure, and are very good at tasks which require these kinds of skills. ESFJs should be careful about controling people in their lives who do not wish to be controlled.

ESFJs respect and believe in the laws and rules of authority, and believe that others should do so as well. They're traditional, and prefer to do things in the established way, rather than venturing into unchartered territory. Their need for security drives their ready acceptance and adherence to the policies of the established system. This tendency may cause them to sometimes blindly accept rules without questioning or understanding them.

An ESFJ who has developed in a less than ideal way may be prone to being quite insecure, and focus all of their attention on pleasing others. He or she might also be very controling, or overly sensitive, imagining bad intentions when there weren't any.

ESFJs incorporate many of the traits that are associated with women in our society. However, male ESFJs will usually not appear feminine at all. On the contrary, ESFJs are typically quite conscious about gender roles and will be most comfortable playing a role that suits their gender in our society. Male ESFJs will be quite masculine (albeit sensitive when you get to know them), and female ESFJs will be very feminine.

ESFJs at their best are warm, sympathetic, helpful, cooperative, tactful, down-to-earth, practical, thorough, consistent, organized, enthusiastic, and energetic. They enjoy tradition and security, and will seek stable lives that are rich in contact with friends and family.`,
  ISTP: `As an ISTP, your primary mode of living is focused internally, where you deal with things rationally and logically. Your secondary mode is external, where you take things in via your five senses in a literal, concrete fashion.

ISTPs have a compelling drive to understand the way things work. They're good at logical analysis, and like to use it on practical concerns. They typically have strong powers of reasoning, although they're not interested in theories or concepts unless they can see a practical application. They like to take things apart and see the way they work.

ISTPs have an adventuresome spirit. They are attracted to motorcycles, airplanes, sky diving, surfing, etc. They thrive on action, and are usually fearless. ISTPs are fiercely independent, needing to have the space to make their own decisions about their next step. They do not believe in or follow rules and regulations, as this would prohibit their ability to "do their own thing". Their sense of adventure and desire for constant action makes ISTPs prone to becoming bored rather quickly.

ISTPs are loyal to their causes and beliefs, and are firm believers that people should be treated with equity and fairness. Although they do not respect the rules of the "System", they follow their own rules and guidelines for behavior faithfully. They will not take part in something which violates their personal laws. ISTPs are extremely loyal and faithful to their "brothers".

ISTPs like and need to spend time alone, because this is when they can sort things out in their minds most clearly. They absorb large quantities of impersonal facts from the external world, and sort through those facts, making judgments, when they are alone.

ISTPs are action-oriented people. They like to be up and about, doing things. They are not people to sit behind a desk all day and do long-range planning. Adaptable and spontaneous, they respond to what is immediately before them. They usually have strong technical skills, and can be effective technical leaders. They focus on details and practical things. They have an excellent sense of expediency and grasp of the details which enables them to make quick, effective decisions.

ISTPs avoid making judgments based on personal values - they feel that judgments and decisions should be made impartially, based on the fact. They are not naturally tuned in to how they are affecting others. They do not pay attention to their own feelings, and even distrust them and try to ignore them, because they have difficulty distinguishing between emotional reactions and value judgments. This may be a problem area for many ISTPs.

An ISTP who is over-stressed may exhibit rash emotional outbursts of anger, or on the other extreme may be overwhelmed by emotions and feelings which they feel compelled to share with people (often inappropriately). An ISTP who is down on themself will foray into the world of value judgments - a place which is not natural for the ISTP - and judge themself by their inability to perform some task. They will then approach the task in a grim emotional state, expecting the worst.

ISTPs are excellent in a crisis situations. They're usually good athletes, and have very good hand-eye coordination. They are good at following through with a project, and tying up loose ends. They usually don't have much trouble with school, because they are introverts who can think logically. They are usually patient individuals, although they may be prone to occasional emotional outbursts due to their inattention to their own feelings.

ISTPs have a lot of natural ability which makes them good at many different kinds of things. However, they are happiest when they are centered in action-oriented tasks which require detailed logical analysis and technical skill. They take pride in their ability to take the next correct step.

ISTPs are optimistic, full of good cheer, loyal to their equals, uncomplicated in their desires, generous, trusting and receptive people who want no part in confining commitments.`,
  ISFP: `As an ISFP, your primary mode of living is focused internally, where you deal with things according to how you feel about them, or how they fit into your value system. Your secondary mode is external, where you take things in via your five sense in a literal, concrete fashion.

ISFPs live in the world of sensation possibilities. They are keenly in tune with the way things look, taste, sound, feel and smell. They have a strong aesthetic appreciation for art, and are likely to be artists in some form, because they are unusually gifted at creating and composing things which will strongly affect the senses. They have a strong set of values, which they strive to consistently meet in their lives. They need to feel as if they're living their lives in accordance with what they feel is right, and will rebel against anything which conflicts with that goal. They're likely to choose jobs and careers which allow them the freedom of working towards the realization of their value-oriented personal goals.

ISFPs tend to be quiet and reserved, and difficult to get to know well. They hold back their ideas and opinions except from those who they are closest to. They are likely to be kind, gentle and sensitive in their dealings with others. They are interested in contributing to people's sense of well-being and happiness, and will put a great deal of effort and energy into tasks which they believe in.

ISFPs have a strong affinity for aesthetics and beauty. They're likely to be animal lovers, and to have a true appreciation for the beauties of nature. They're original and independent, and need to have personal space. They value people who take the time to understand the ISFP, and who support the ISFP in pursuing their goals in their own, unique way. People who don't know them well may see their unique way of life as a sign of carefree light-heartedness, but the ISFP actually takes life very seriously, constantly gathering specific information and shifting it through their value systems, in search for clarification and underlying meaning.

ISFPs are action-oriented individuals. They are "doers", and are usually uncomfortable with theorizing concepts and ideas, unless they see a practical application. They learn best in a "hands-on" environment, and consequently may become easily bored with the traditional teaching methods, which emphasize abstract thinking. They do not like impersonal analysis, and are uncomfortable with the idea of making decisions based strictly on logic. Their strong value systems demand that decisions are evaluated against their subjective beliefs, rather than against some objective rules or laws.

ISFPs are extremely perceptive and aware of others. They constantly gather specific information about people, and seek to discover what it means. They are usually penetratingly accurate in their perceptions of others.

ISFPs are warm and sympathetic. They genuinely care about people, and are strongly service-oriented in their desire to please. They have an unusually deep well of caring for those who are close to them, and are likely to show their love through actions, rather than words.

ISFPs have no desire to lead or control others, just as they have no desire to be led or controlled by others. They need space and time alone to evaluate the circumstances of their life against their value system, and are likely to respect other people's needs for the same.

The ISFP is likely to not give themself enough credit for the things which they do extremely well. Their strong value systems can lead them to be intensely perfectionist, and cause them to judge themselves with unneccesary harshness.

The ISFP has many special gifts for the world, especially in the areas of creating artistic sensation, and selflessly serving others. Life is not likely to be extremely easy for the ISFP, because they take life so seriously, but they have the tools to make their lives and the lives of those close to them richly rewarding experiences.`,
  ESTP: `As an ESTP, your primary mode of living is focused externally, where you take things in via your five senses in a literal, concrete fashion. Your secondary mode is internal, where you deal with things rationally and logically.

ESTPs are outgoing, straight-shooting types. Enthusiastic and excitable, ESTPs are "doers" who live in the world of action. Blunt, straight-forward risk-takers, they are willing to plunge right into things and get their hands dirty. They live in the here-and-now, and place little importance on introspection or theory. The look at the facts of a situation, quickly decide what should be done, execute the action, and move on to the next thing.

ESTPs have an uncanny ability to perceive people's attitudes and motivations. They pick up on little cues which go completely unnoticed by most other types, such as facial expressions and stance. They're typically a couple of steps ahead of the person they're interacting with. ESTPs use this ability to get what they want out of a situation. Rules and laws are seen as guidelines for behavior, rather than mandates. If the ESTP has decided that something needs to be done, then their "do it and get on with it" attitude takes precendence over the rules. However, the ESTP tends to have their own strong belief in what's right and what's wrong, and will doggedly stick to their principles. The Rules of the Establishment may hold little value to the ESTP, but their own integrity mandates that they will not under any circumstances do something which they feel to be wrong.

ESTPs have a strong flair for drama and style. They're fast-moving, fast-talking people who have an appreciation for the finer things in life. They may be gamblers or spendthrifts. They're usually very good at story telling and improvising. They typically makes things up as they go along, rather than following a plan. They love to have fun, and are fun people to be around. They can sometimes be hurtful to others without being aware of it, as they generally do not know and may not care about the effect their words have on others. It's not that they don't care about people, it's that their decision-making process does not involve taking people's feelings into account. They make decisions based on facts and logic.

ESTP's least developed area is their intuitive side. They are impatient with theory, and see little use for it in their quest to "get things done". An ESTP will occasionally have strong intuitions which are often way off-base, but sometimes very lucid and positive. The ESTP does not trust their instincts, and is suspicious of other people's intuition as well.

The ESTP often has trouble in school, especially higher education which moves into realms where theory is more important. The ESTP gets bored with classes in which they feel they gain no useful material which can be used to get things done. The ESTP may be brilliantly intelligent, but school will be a difficult chore for them.

The ESTP needs to keep moving, and so does well in careers where he or she is not restricted or confined. ESTPs make extremely good salespersons. They will become stifled and unhappy dealing with routine chores. ESTPs have a natural abundance of energy and enthusiasm, which makes them natural entrepreneurs. They get very excited about things, and have the ability to motivate others to excitement and action. The can sell anyone on any idea. They are action-oriented, and make decisions quickly. All-in-all, they have extraordinary talents for getting things started. They are not usually so good at following through, and might leave those tasks to others. Mastering the art of following through is something which ESTPs should pay special attention to.

ESTPs are practical, observant, fun-loving, spontaneous risk-takers with an excellent ability to quickly improvise an innovative solution to a problem. They're enthusiastic and fun to be with, and are great motivators. If an ESTP recognizes their real talents and operates within those realms, they can accomplish truly exciting things.`,
  ESFP: `As an ESFP, your primary mode of living is focused externally, where you take things in via your five senses in a literal, concrete fashion. Your secondary mode is internal, where you deal with things according to how you feel about them, or how they fit with your personal value system.

ESFPs live in the world of people possibilties. They love people and new experiences. They are lively and fun, and enjoy being the center of attention. They live in the here-and-now, and relish excitement and drama in their lives.

ESFPs have very strong inter-personal skills, and may find themselves in the role of the peacemaker frequently. Since they make decisions by using their personal values, they are usually very sympathetic and concerned for other people's well-being. They're usually quite generous and warm. They are very observant about other people, and seem to sense what is wrong with someone before others might, responding warmly with a solution to a practical need. They might not be the best advice-givers in the world, because they dislike theory and future-planning, but they are great for giving practical care.

ESFP is definitely a spontaneous, optimistic individual. They love to have fun. If the ESFP has not developed their Thinking side by giving consideration to rational thought processing, they tend to become over-indulgent, and place more importance on immediate sensation and gratification than on their duties and obligations. They may also avoid looking at long-term consequences of their actions.

For the ESFP, the entire world is a stage. They love to be the center of attention and perform for people. They're constantly putting on a show for others to entertain them and make them happy. They enjoy stimulating other people's senses, and are extremely good at it. They would love nothing more than for life to be a continual party, in which they play the role of the fun-loving host.

ESFPs love people, and everybody loves an ESFP. One of their greatest gifts is their general acceptance of everyone. They are upbeat and enthusiastic, and genuinely like almost everybody. An ESFP is unfailingly warm and generous with their friends, and they generally treat everyone as a friend. However, once crosesed, an ESFP is likely to make a very strong and stubborn judgment against the person who crossed them. They are capable of deep dislike in such a situation.

The ESFP under a great deal of stress gets overwhelmed with negatives thoughts and possibilities. As an optimistic individual who lives in the world of possibilities, negative possibilities do not sit well with them. In an effort to combat these thoughts, they're likely to come up with simple, global statements to explain away the problem. These simplistic explanations may or may not truly get to the nature of the issue, but they serve the ESFP well by allowing them to get over it.

ESFPs are likely to be very practical, although they hate structure and routine. They like to "go with the flow", trusting in their ability to improvise in any situation presented to them. They learn best with "hands-on" experience, rather than by studying a book. They're uncomfortable with theory. If an ESFP hasn't developed their intuitive side, they may tend to avoid situations which involve a lot of theoretical thinking, or which are complex and ambiguous. For this reason, an ESFP may have difficulty in school. On the other hand, the ESFP does extremely well in situations where they're allowed to learn by interacting with others, or in which they "learn by doing".

ESFPs have a very well-developed appreciation for aesthetic beauty, and an excellent sense of space and function. If they have the means, they're likely to have to have many beautiful possessions, and an artfully furnished home. In general, they take great pleasure in objects of aesthetic beauty. They're likely to have a strong appreciation for the finer things in life, such as good food and good wine.

The ESFP is a great team player. He or she is not likely to create any problems or fuss, and is likely to create the most fun environment possible for getting the task done. ESFPs will do best in careers in which they are able to use their excellent people skills, along with their abilities to meld ideas into structured formats. Since they are fast-paced individuals who like new experiences, they should choose careers which offer or require a lot of diversity, as well as people skills.

ESFPs usually like to feel strongly bonded with other people, and have a connection with animals and small children that is not found in most other types. They're likely to have a strong appreciation for the beauties of nature as well.

The ESFP has a tremendous love for life, and knows how to have fun. They like to bring others along on their fun-rides, and are typically a lot of fun to be with. They're flexible, adaptable, genuinely interested in people, and usually kind-hearted. They have a special ability to get a lot of fun out of life, but they need to watch out for the pitfalls associated with living entirely in the moment.`,
};

const typeName = {
  E: "Extrovert",
  I: "Introvert",
  S: "Sensor",
  N: "Intuitive",
  T: "Thinker",
  F: "Feeler",
  P: "Perceiver",
  J: "Judger",
};

const typeImgLinks = {
  INTJ: "Imaginative and strategic thinkers, with a plan for everything.",
  INTP: "Innovative inventors with an unquenchable thirst for knowledge.",
  ENTJ: "Bold, imaginative and strong-willed leaders, always finding a way – or making one.",
  ENTP: "Smart and curious thinkers who cannot resist an intellectual challenge.",
  INFJ: "Quiet and mystical, yet very inspiring and tireless idealists.",
  INFP: "Poetic, kind and altruistic people, always eager to help a good cause",
  ENFJ: "Charismatic and inspiring leaders, able to mesmerize their listeners.",
  ENFP: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
  ISTJ: "Practical and fact-minded individuals, whose reliability cannot be doubted.",
  ISFJ: "Very dedicated and warm protectors, always ready to defend their loved ones.",
  ESTJ: "Excellent administrators, unsurpassed at managing things – or people.",
  ESFJ: "Extraordinarily caring, social and popular people, always eager to help.",
  ISTP: "Bold and practical experimenters, masters of all kinds of tools.",
  ISFP: "Flexible and charming artists, always ready to explore and experience something new.",
  ESTP: "Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
  ESFP: "Spontaneous, energetic and enthusiastic people – life is never boring around them.",
};

const typeMatrix = [
  ["E", "I"],
  ["S", "N"],
  ["T", "F"],
  ["J", "P"],
];

export default function MBTIResultDialog(props: {
  MBTI: string;
  open: boolean;
  handleClose: Function;
}) {
  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (props.open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [props.open]);
  return (
    <>
      <Dialog
        open={props.open}
        onClose={() => props.handleClose()}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Your Personality Test Result
        </DialogTitle>
        <DialogContent dividers={false}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            style={{ whiteSpace: "pre-wrap" }}
          >
            <Typography
              variant="h1"
              color="textPrimary"
              style={{ textAlign: "center" }}
            >
              {props.MBTI}
            </Typography>
            <Typography
              variant="h6"
              color="initial"
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              {typeName[props.MBTI.split("")[0]]}{" "}
              {typeName[props.MBTI.split("")[1]]}{" "}
              {typeName[props.MBTI.split("")[2]]}{" "}
              {typeName[props.MBTI.split("")[3]]}
              {"\n "}
            </Typography>
            <Typography
              variant="body1"
              color="textPrimary"
              style={{ textAlign: "center", fontWeight: "bold" }}
            >
              {typeSummary[props.MBTI]}
              {"\n\n\n"}
            </Typography>
            <Typography variant="body1" color="textPrimary">
              {typeDescription[props.MBTI]}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.handleClose()}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
