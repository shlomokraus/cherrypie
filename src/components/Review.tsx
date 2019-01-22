import React, { useEffect, useContext, useState } from "react";
import { useSlices } from "../hooks/slices";
import { useGlobalState } from "../context/GlobalState";
import { CherryContext } from "../context/Cherry";
import shortid from "shortid";
import { useCurrentPr } from "../hooks/currentPr";
import { CloseBtn } from "./CloseBtn";
import { Formik, Form, Field } from "formik";

export const Review = () => {
  const cherry = useContext(CherryContext);
  const { slices, removeSlice } = useSlices();
  const [route, setRoute] = useGlobalState("route");
  const [sliceInfo, setSliceInfo] = useGlobalState("sliceInfo");
  const [target, setTarget] = useState();
  const { pr } = useCurrentPr();
  if (!pr) {
    return <div>Pull request not loaded</div>;
  }

  const source = pr.head.ref;

  const validate = values => {
    let errors: any = {};
    if (!values.title) {
      errors.title = "Required";
    }
    if (!values.target) {
      errors.target = "Required";
    }

    return errors as any;
  };

  useEffect(()=>{
    setTarget(source + "-" + shortid.generate());
  }, [])

  const initialValues =  sliceInfo ? sliceInfo : {
    target,
    body: `supporting: #${pr.number}`
  };

  return (
    <div>
      <Formik
      enableReinitialize={true}
        validate={validate}
        initialValues={initialValues}
        onSubmit={(values)=>{
          setSliceInfo(values);
          setRoute("/execute");
        }}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset
          } = props;
          const { target, title, body } = values;

          return (
            <>
              <div className="Box-header">
                <h3 className="Box-title">REVIEW CHANGES</h3>
              </div>

              <div className="flash flash-full">
                {`You are about to slice ${
                  slices.length
                } updates from ${source}`}
              </div>

              <div className="Box-body">
                <form>
                  <div className="Subhead">
                    <div className="Subhead-heading">Open pull request</div>
                  </div>

                  <dl className={"form-group" + (errors.title ? " errored" : "")}>
                    <dt>
                      <label htmlFor="example-textarea">Title</label>
                    </dt>
                    <dd>
                    <input name="title" value={title} onChange={handleChange} className="form-control" type="text" />

                    </dd>
                    <dd className="error" id="form-error-text">{errors.title}</dd>

                  </dl>
                  <dl className="form-group">
                    <dt>
                      <label htmlFor="example-textarea">Body</label>
                    </dt>
                    <dd>
                    <textarea name="body" value={body} onChange={handleChange} className="form-control"  />

                    </dd>
                  </dl>
                  <dl className={"form-group" + (errors.target ? " errored" : "")}>
                    <dt>
                      <label htmlFor="example-text">Target branch</label>
                      <p className="note" id="help-text-for-checkbox">
                        <strong>warning:</strong> if branch exists, push will{" "}
                        <strong>overwrite</strong> any other changes.
                      </p>
                    </dt>
                    <dd>
                    <input aria-describedby="form-error-text" name="target" value={target} onChange={handleChange} className="form-control" type="text" />
                    </dd>
                    <dd className="error" id="form-error-text">{errors.target}</dd>
                  </dl>
               
                </form>
              </div>

              <div className="Box-footer text-right">
                <CloseBtn label={"Cancel"} />
                <button
                  type="button"
                  className="btn  mr-2"
                  onClick={() => setRoute("/files")}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="btn btn-primary"
                  autoFocus
                >
                  Slice!
                </button>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};
