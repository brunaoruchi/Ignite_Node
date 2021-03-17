/**
 * name - string
 * duration - number
 * educator - string
 */

interface Course {
  name: string;
  duration?: number;
  educator: string;
}


class CreateCourseService {

  //Valor default duration = 8;
  execute({duration = 8, educator, name}: Course){
    console.log(name, duration, educator);
  }
}

export default new CreateCourseService;