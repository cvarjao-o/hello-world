


function Stage (name, steps=undefined, options={}){
  if (name == null) throw Error("name cannot be null or undefined")
  if (name.indexOf('.')>=0) throw Error("name cannot contain dot(.)")
  this.name=name;
  this.steps=steps;
  this.options=options;
  this._path = name
  //console.log(`creating '${name}'`)
  if (this.steps instanceof Array){
    for (var i=0; i < this.steps.length; i++){
      var step= this.steps[i]
      step._parent=this
      //step._root=this._root
      //step._path = `${this._path}.${step._path}`

      //this._root._stages = this._root._stages || []
      //this._root._stages.push(...step._stages)
      //delete step._stages
    }
  }
  

  //this.initialize()
}

Stage.prototype.initialize = function (){
  //console.log(`Initializing '${this._path}'`)
  //object._root._stages = object._root._stages || []
  //object._root._stages.push(object)
}

Stage.prototype.next = function (){
  var args = Array.prototype.slice.call(arguments, 0)
  var constructor = Stage;
  var object = Object.create(constructor.prototype);

  constructor.apply(object, args);
  if(this !== global){
    object._root=this._root
    object._previous = this
    this._next = object
  }else{
    object._root=object
  }

  //object.initialize()
  //object._root._stages = object._root._stages || []
  //object._root._stages.push(object)
  return object;
}
Stage.prototype.done = async function (){
  if (this !== this._root) return this._root.done()
  console.log(`done '${this._path}'`)

  var _stages = new Map()
  var _root = this;

  var collect = (stage)=>{
    stage._root = _root
    if (stage._parent != null){
      stage._path = stage._parent._path + '.' + stage.name
    }
    _stages.set(stage._path, stage)
    if (stage.steps instanceof Array){
      stage.steps.forEach(subStage =>{
        subStage._parent=stage
        collect(subStage)
      })
    }
    if (stage._next !=null){
      collect(stage._next)
    }
  }
  collect(this)

  _stages.forEach(stage =>{
    console.log(stage._path)
  })

  var skipUntil = "test.security"
  var run = async (stage)=>{
    var promises =[]
    if (stage.steps !=null){
      if (!(stage.steps instanceof Array)){
        promises.push(Promise.resolve(stage).then(stage => {
          stage.steps(stage)
          return stage
        }))
      }else{
        stage.steps.forEach(subStage =>{
          promises.push(run(subStage))
        })
      }
    }
    return Promise.all(promises).then(result => {
      if (stage._next != null){
        run(stage._next)
      }
    })
  }

  var planned =[]
  console.log("")
  console.log("")
  console.log("")
  await run(this)
}

const stage = Stage.prototype.next
const pipeline =  function (chain){
  chain.done()
}

pipeline(
  stage("build", (stage)=>{
    console.log(`Running '${stage.name}'`)
  })
  .next("qa", (stage)=>{
    console.log(`Running '${stage.name}'`)
  })
  .next("test", [
    stage("functional", (stage)=>{
      console.log(`Running '${stage.name}'`)
    }),
    stage("security", (stage)=>{
      console.log(`Running '${stage.name}'`)
    })
  ])
  .next("deploy-dev", (stage)=>{
    console.log(`Running '${stage.name}'`)
  })
  .next("deploy-test", (stage)=>{
    console.log(`Running '${stage.name}'`)
  })
  .next("deploy-prod", (stage)=>{
    console.log(`Running '${stage.name}'`)
  })
  .next("terminate", (stage)=>{
    console.log(`Running '${stage.name}'`)
  })
)
